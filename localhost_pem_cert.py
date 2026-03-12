import os, sys, shutil, platform, time, urllib.request, tempfile, subprocess, socket, ssl
from pathlib import Path
MKCERT_VERSION = "v1.4.4"
DOWNLOAD_BASE = f"https://github.com/FiloSottile/mkcert/releases/download/{MKCERT_VERSION}"
PROXY_LIST = ["https://gh-proxy.org/https://","https://hk.gh-proxy.org/https://","https://cdn.gh-proxy.org/https://"]
DOWNLOAD_TIMEOUT = 120
PROGRESS_BAR_LENGTH: int = 50
class DownloadProgress:
    def __init__(self):
        self.start_time: float = 0.0
        self.downloaded: int = 0
        self.total: int = 0
        self.last_update: float = 0.0
    def format_size(self, size: int) -> str:
        units = ["B", "KB", "MB", "GB"]
        unit_idx = 0
        while size >= 1024 and unit_idx < len(units) - 1:
            size /= 1024
            unit_idx += 1
        return f"{size:.2f} {units[unit_idx]}"
    def format_speed(self, bytes_per_second: float) -> str:
        return self.format_size(int(bytes_per_second)) + "/s"
    def update(self, block_num: int, block_size: int, total_size: int) -> None:
        if self.start_time == 0:
            self.start_time = time.time()
            self.downloaded = 0
            self.total = total_size
        self.downloaded = min(block_num * block_size, total_size)
        current_time = time.time()
        if current_time - self.last_update < 0.1 and self.downloaded < self.total:
            return
        self.last_update = current_time
        if self.total <= 0:
            progress = 0.0
        else:
            progress = self.downloaded / self.total
        elapsed = current_time - self.start_time
        if elapsed <= 0 or self.downloaded <= 0:
            speed = 0.0
            eta = 0
        else:
            speed = self.downloaded / elapsed
            eta = int((self.total - self.downloaded) / speed) if speed > 0 else 0
        filled_length = int(PROGRESS_BAR_LENGTH * progress)
        progress_bar = "█" * filled_length + "-" * (PROGRESS_BAR_LENGTH - filled_length)
        percent = f"{progress * 100:.1f}%"
        downloaded_str = self.format_size(self.downloaded)
        total_str = self.format_size(self.total) if self.total > 0 else "未知"
        speed_str = self.format_speed(speed) if speed > 0 else "0 B/s"
        eta_str = f"{eta}s" if eta > 0 else "∞"
        sys.stdout.write(
            f"\r[下载进度] |{progress_bar}| {percent} "
            f"{downloaded_str}/{total_str} "
            f"速度: {speed_str} "
            f"剩余: {eta_str}"
        )
        sys.stdout.flush()
        if self.downloaded >= self.total and self.total > 0:
            print()
def print_info(msg):
    print(f"\033[34m[INFO]\033[0m {msg}")

def print_success(msg):
    print(f"\033[32m[SUCCESS]\033[0m {msg}")

def print_error(msg):
    print(f"\033[31m[ERROR]\033[0m {msg}")
    sys.exit(1)
def print_warning(msg):
    print(f"\033[33m[WARNING]\033[0m {msg}")
def get_system_info():
    system = platform.system()
    arch = platform.machine().lower()
    if system == "Windows":
        if arch in ["amd64", "x86_64"]:
            return "windows", "amd64", "exe"
        elif arch == "arm64":
            return "windows", "arm64", "exe"
        else:
            print_error(f"不支持的 Windows 架构: {arch}")
    elif system == "Linux":
        if arch in ["x86_64", "amd64"]:
            return "linux", "amd64", ""
        elif arch.startswith("armv7"):
            return "linux", "arm", ""
        elif arch in ["aarch64", "arm64"]:
            return "linux", "arm64", ""
        else:
            print_error(f"不支持的 Linux 架构: {arch}")
    else:
        print_error(f"不支持的操作系统: {system} (仅支持 Windows/Linux)")
def download_with_retry(url, save_path):
    print_info(f"尝试直接下载: {url}")
    if download_file(url, save_path):
        return True
    print_warning("直接下载失败，可能是网络限制，尝试使用 GitHub 代理...")
    print_info("可选代理地址：")
    for i, proxy in enumerate(PROXY_LIST, 1):
        print(f"  {i}. {proxy.rstrip('https://')}")
    choice: int = 1
    while True:
        try:
            user_input: str = input(f"\n请选择代理序号 (1-{len(PROXY_LIST)}，回车默认1): ").strip()
            if user_input:
                choice = int(user_input)
                if 1 <= choice <= len(PROXY_LIST):
                    break
                else:
                    print_warning(f"请输入 1-{len(PROXY_LIST)} 之间的数字")
            else:
                break
        except ValueError:
            print_warning("输入无效，请输入数字")
    proxy_prefix: str = PROXY_LIST[choice-1]
    proxy_url: str = proxy_prefix + url.lstrip("https://")
    print_info(f"使用代理下载: {proxy_url}")
    if download_file(proxy_url, save_path):
        return True
    else:
        print_error("所有下载方式均失败，请检查网络或稍后重试")
def download_file(url: str, save_path: Path) -> bool:
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
        urllib.request.install_opener(opener)
        socket.setdefaulttimeout(DOWNLOAD_TIMEOUT)
        progress = DownloadProgress()
        urllib.request.urlretrieve(
            url,
            str(save_path),
            reporthook=progress.update
        )
        print_success(f"文件下载完成: {save_path.name} ({progress.format_size(progress.total)})")
        return True
    except socket.timeout:
        print_warning(f"\n下载超时（{DOWNLOAD_TIMEOUT}秒）")
        return False
    except Exception as e:
        print_warning(f"\n下载出错: {str(e)[:100]}")
        return False
def run_command(cmd, description):
    print_info(f"{description}: {' '.join(cmd)}")
    try:
        result = subprocess.run(
            cmd,
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8"
        )
        return result
    except subprocess.CalledProcessError as e:
        print_error(f"{description}失败: {e.stderr[:200]}")
    except Exception as e:
        print_error(f"{description}出错: {str(e)[:200]}")
def main():
    BORDER_CHAR = "="
    TITLE_PADDING = 12
    INFO_COLOR = "\033[36m"
    TITLE_COLOR = "\033[32m"
    TEXT_COLOR = "\033[37m"
    RESET_COLOR = "\033[0m"
    border_length = 60
    border_line = BORDER_CHAR * border_length
    print(f"\n{TITLE_COLOR}{border_line}{RESET_COLOR}")
    print(f"{TITLE_COLOR}{' ' * TITLE_PADDING}mkcert 自动安装 & 证书生成工具 {RESET_COLOR}")
    print(f"{TITLE_COLOR}{border_line}{RESET_COLOR}")
    print(f"\n{INFO_COLOR}工具说明：{RESET_COLOR}")
    print(f"{TEXT_COLOR}   1. 自动检测系统架构（Windows/Linux amd64/arm64/arm）")
    print(f"   2. 自动下载对应版本的 mkcert 二进制文件")
    print(f"   3. 支持 GitHub 代理下载（解决网络访问问题）")
    print(f"   4. 自动初始化根证书并生成 localhost HTTPS 证书")
    print(f"   5. 自动整理证书文件到 cert 目录{RESET_COLOR}")
    copyright_text = "© 2024–2026 EndlessPixel Studio. Created by system_mini."
    copyright_padding = (border_length - len(copyright_text)) // 2
    print(f"\n{INFO_COLOR}{' ' * copyright_padding}{copyright_text}{RESET_COLOR}")
    print("5s后开始执行...\n按下 Ctrl+C / Command+C 可中止操作。")
    time.sleep(5)
    print(f"\n{TEXT_COLOR}开始执行...{RESET_COLOR}\n")
    system, arch, ext = get_system_info()
    print_info(f"检测到系统: {system} ({arch})")
    filename = f"mkcert-{MKCERT_VERSION}-{system}-{arch}"
    if ext:
        filename += f".{ext}"
    download_url = f"{DOWNLOAD_BASE}/{filename}"
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_file = Path(temp_dir) / filename
        if not download_with_retry(download_url, temp_file):
            sys.exit(1)
        if system == "Linux":
            temp_file.chmod(0o755)
        mkcert_path = str(temp_file)
        if system == "Windows":
            system_dir = Path(os.environ["SystemRoot"]) / "System32"
            target_path = system_dir / "mkcert.exe"
            try:
                shutil.copy2(temp_file, target_path)
                mkcert_path = "mkcert.exe"
                print_success(f"mkcert 已安装到: {target_path}")
            except PermissionError:
                print_warning("无管理员权限，使用临时路径运行 mkcert")
        else:
            target_path = Path("/usr/local/bin/mkcert")
            try:
                run_command(["sudo", "cp", str(temp_file), str(target_path)], "安装 mkcert 到系统目录")
                mkcert_path = "mkcert"
            except:
                print_warning("无 sudo 权限，使用临时路径运行 mkcert")
        run_command([mkcert_path, "-install"], "初始化根证书")
        run_command(
            [mkcert_path, "localhost", "127.0.0.1", "::1"],
            "生成本地证书"
        )
        cert_dir = Path("cert")
        cert_dir.mkdir(exist_ok=True)
        for cert_file in ["localhost.pem", "localhost-key.pem"]:
            file_path = Path(cert_file)
            if file_path.exists():
                dest_path = cert_dir / cert_file
                shutil.move(file_path, dest_path)
                print_info(f"证书已移动到: {dest_path}")
    print("\n" + "=" * 50)
    print_success("证书生成完成！")
    print_info(f"证书目录: {Path.cwd() / 'cert'}")
    print_info("下一步可执行: npm run dev-https")
    print("=" * 50)
if __name__ == "__main__":
    if sys.version_info < (3, 6):
        print_error("需要 Python 3.6 及以上版本，请升级 Python 后重试")
    try:
        main()
    except KeyboardInterrupt:
        print("\n" + print_warning("用户中断操作"))
        sys.exit(0)
    except Exception as e:
        print_error(f"程序异常退出: {str(e)}")