import os, sys, shutil, platform, time, urllib.request, tempfile, subprocess, socket, ssl, glob
from pathlib import Path
from typing import Tuple, List

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
        elif arch in ["x86", "i386", "i686"]:
            return "windows", "386", "exe"
        else:
            print_error(f"不支持的 Windows 架构: {arch}")
    elif system == "Linux":
        if arch in ["x86_64", "amd64"]:
            return "linux", "amd64", ""
        elif arch.startswith("armv7"):
            return "linux", "arm", ""
        elif arch in ["aarch64", "arm64"]:
            return "linux", "arm64", ""
        elif arch in ["x86", "i386", "i686"]:
            return "linux", "386", ""
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

def run_command(cmd, description, check=True):
    """运行命令并返回结果，check=False 时不会退出"""
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
        if check:
            print_error(f"{description}失败: {e.stderr[:200]}")
        else:
            print_warning(f"{description}失败: {e.stderr[:200]}")
            return None
    except Exception as e:
        if check:
            print_error(f"{description}出错: {str(e)[:200]}")
        else:
            print_warning(f"{description}出错: {str(e)[:200]}")
            return None

def install_mkcert_system(temp_file: Path, system: str) -> Tuple[str, bool]:
    """安装 mkcert 到系统路径，返回 (可执行路径, 是否成功)"""
    if system == "Windows":
        system_dir = Path(os.environ["SystemRoot"]) / "System32"
        target_path = system_dir / "mkcert.exe"
        try:
            shutil.copy2(temp_file, target_path)
            print_success(f"mkcert 已安装到: {target_path}")
            return "mkcert.exe", True
        except PermissionError:
            print_warning("无管理员权限，使用临时路径运行 mkcert")
            return str(temp_file), False
        except Exception as e:
            print_warning(f"安装失败: {e}，使用临时路径运行")
            return str(temp_file), False
    else:  # Linux
        target_path = Path("/usr/local/bin/mkcert")
        try:
            shutil.copy2(temp_file, target_path)
            target_path.chmod(0o755)
            print_success(f"mkcert 已安装到: {target_path}")
            return "mkcert", True
        except PermissionError:
            print_info("需要管理员权限来安装 mkcert 到系统目录")
            try:
                subprocess.run(
                    ["sudo", "cp", str(temp_file), str(target_path)],
                    check=True,
                    capture_output=True,
                    text=True
                )
                subprocess.run(
                    ["sudo", "chmod", "755", str(target_path)],
                    check=True,
                    capture_output=True,
                    text=True
                )
                print_success(f"mkcert 已安装到: {target_path}")
                return "mkcert", True
            except subprocess.CalledProcessError as e:
                print_warning(f"安装到系统目录失败: {e.stderr[:200]}，使用临时路径运行")
                return str(temp_file), False
            except Exception as e:
                print_warning(f"安装到系统目录失败: {e}，使用临时路径运行")
                return str(temp_file), False
        except Exception as e:
            print_warning(f"安装失败: {e}，使用临时路径运行")
            return str(temp_file), False

def organize_certificates():
    """整理证书文件到 cert 目录"""
    cert_dir = Path("cert")
    cert_dir.mkdir(exist_ok=True)
    
    # 查找所有可能的证书文件
    cert_patterns = [
        "localhost.pem",
        "localhost-key.pem",
        "localhost+*.pem",
        "localhost+*-key.pem",
        "*.pem"  # 兜底
    ]
    
    cert_files: List[Path] = []
    for pattern in cert_patterns:
        cert_files.extend(Path(".").glob(pattern))
    
    # 去重并排序
    cert_files = list(set(cert_files))
    
    if not cert_files:
        print_warning("没有找到证书文件")
        return False
    
    # 分类证书和密钥
    cert_pem = None
    key_pem = None
    
    for file in cert_files:
        name = file.name
        if name.endswith("-key.pem"):
            if key_pem is None or len(name) < len(key_pem.name):
                key_pem = file
        elif name.endswith(".pem") and not name.endswith("-key.pem"):
            if cert_pem is None or len(name) < len(cert_pem.name):
                cert_pem = file
    
    # 如果没找到标准的，尝试找任何 .pem 和 -key.pem 配对
    if not cert_pem or not key_pem:
        pem_files = [f for f in cert_files if f.suffix == ".pem" and "-key" not in f.name]
        key_files = [f for f in cert_files if "-key.pem" in f.name]
        
        if pem_files:
            cert_pem = pem_files[0]
        if key_files:
            key_pem = key_files[0]
    
    # 移动文件
    moved = False
    if cert_pem:
        dest = cert_dir / "localhost.pem"
        if cert_pem != dest:
            # 备份已存在的文件
            if dest.exists():
                backup = cert_dir / f"localhost.pem.bak.{int(time.time())}"
                shutil.move(dest, backup)
                print_info(f"已备份原证书: {backup}")
            shutil.move(cert_pem, dest)
            print_success(f"证书已移动到: {dest}")
            moved = True
        else:
            print_info(f"证书已在正确位置: {dest}")
    
    if key_pem:
        dest = cert_dir / "localhost-key.pem"
        if key_pem != dest:
            if dest.exists():
                backup = cert_dir / f"localhost-key.pem.bak.{int(time.time())}"
                shutil.move(dest, backup)
                print_info(f"已备份原密钥: {backup}")
            shutil.move(key_pem, dest)
            print_success(f"密钥已移动到: {dest}")
            moved = True
        else:
            print_info(f"密钥已在正确位置: {dest}")
    
    # 清理其他证书文件
    for file in cert_files:
        if file != cert_pem and file != key_pem:
            try:
                # 检查是否在 cert 目录下
                if not str(file).startswith("cert/"):
                    # 移动到 cert 目录下的 backup 子目录
                    backup_dir = cert_dir / "backup"
                    backup_dir.mkdir(exist_ok=True)
                    shutil.move(file, backup_dir / file.name)
                    print_info(f"已移动到备份目录: {backup_dir / file.name}")
            except Exception as e:
                print_warning(f"清理证书文件失败 {file}: {e}")
    
    return moved

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
        
        # 下载 mkcert
        if not download_with_retry(download_url, temp_file):
            sys.exit(1)

        # 设置可执行权限
        if system == "Linux":
            temp_file.chmod(0o755)

        # 安装 mkcert 到系统
        mkcert_path, installed = install_mkcert_system(temp_file, system)
        
        # 如果安装失败，使用临时文件路径
        if not installed:
            print_info("使用临时路径运行 mkcert")
            temp_file.chmod(0o755)
            mkcert_path = str(temp_file)
        
        print_info(f"mkcert 路径: {mkcert_path}")

        # 初始化根证书
        print_info("初始化根证书...")
        is_root = hasattr(os, 'geteuid') and os.geteuid() == 0
        
        if is_root and system == "Linux":
            original_user = os.environ.get('SUDO_USER') or os.environ.get('USER')
            if original_user and original_user != 'root':
                cmd = ["su", "-", original_user, "-c", f"{mkcert_path} -install"]
                print_info(f"以用户 {original_user} 身份运行")
                try:
                    result = subprocess.run(cmd, check=False, capture_output=True, text=True)
                    if result.returncode == 0:
                        print_success("根证书初始化完成")
                    else:
                        print_warning(f"以普通用户身份运行失败: {result.stderr[:200]}")
                        if run_command([mkcert_path, "-install"], "初始化根证书", check=False):
                            print_success("根证书初始化完成")
                except Exception as e:
                    print_warning(f"切换用户运行失败: {e}")
                    if run_command([mkcert_path, "-install"], "初始化根证书", check=False):
                        print_success("根证书初始化完成")
            else:
                if run_command([mkcert_path, "-install"], "初始化根证书", check=False):
                    print_success("根证书初始化完成")
        else:
            if run_command([mkcert_path, "-install"], "初始化根证书", check=False):
                print_success("根证书初始化完成")

        # 生成证书
        print_info("生成本地证书...")
        cert_args = ["localhost", "127.0.0.1", "::1"]
        
        if is_root and system == "Linux":
            original_user = os.environ.get('SUDO_USER') or os.environ.get('USER')
            if original_user and original_user != 'root':
                cmd_str = f"{mkcert_path} {' '.join(cert_args)}"
                cmd = ["su", "-", original_user, "-c", cmd_str]
                print_info(f"以用户 {original_user} 身份运行")
                try:
                    result = subprocess.run(cmd, check=False, capture_output=True, text=True)
                    if result.returncode == 0:
                        print_success("证书生成完成")
                    else:
                        print_warning(f"以普通用户身份运行失败: {result.stderr[:200]}")
                        if run_command([mkcert_path] + cert_args, "生成本地证书", check=False):
                            print_success("证书生成完成")
                except Exception as e:
                    print_warning(f"切换用户运行失败: {e}")
                    if run_command([mkcert_path] + cert_args, "生成本地证书", check=False):
                        print_success("证书生成完成")
            else:
                if run_command([mkcert_path] + cert_args, "生成本地证书", check=False):
                    print_success("证书生成完成")
        else:
            if run_command([mkcert_path] + cert_args, "生成本地证书", check=False):
                print_success("证书生成完成")

    # 整理证书文件到 cert 目录
    print_info("整理证书文件...")
    organize_certificates()

    print("\n" + "=" * 50)
    print_success("证书生成完成！")
    
    cert_dir = Path("cert")
    if cert_dir.exists():
        print_info(f"证书目录: {cert_dir.absolute()}")
        # 列出证书文件
        cert_files = list(cert_dir.glob("*.pem"))
        if cert_files:
            print_info("生成的证书文件:")
            for f in cert_files:
                size = f.stat().st_size
                print(f"  - {f.name} ({size:,} bytes)")
        else:
            print_warning("证书目录为空，请检查生成过程")
    else:
        print_warning("证书目录不存在")
    
    # 检查 Next.js 配置所需的文件
    required_files = ["localhost.pem", "localhost-key.pem"]
    missing = []
    for req in required_files:
        if not (cert_dir / req).exists():
            missing.append(req)
    
    if missing:
        print_warning(f"缺少必要文件: {', '.join(missing)}")
        print_info("请检查 cert 目录，或手动重命名证书文件")
    else:
        print_success("所有必要的证书文件已就绪！")
    
    print_info("下一步可执行: npm run dev-https")
    print("=" * 50)

if __name__ == "__main__":
    if sys.version_info < (3, 6):
        print_error("需要 Python 3.6 及以上版本，请升级 Python 后重试")
    try:
        main()
    except KeyboardInterrupt:
        print("\n")
        print_warning("用户中断操作")
        sys.exit(0)
    except Exception as e:
        print_error(f"程序异常退出: {str(e)}")