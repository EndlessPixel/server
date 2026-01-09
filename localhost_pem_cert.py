import os
import sys
import shutil
import platform
import time
import urllib.request
import tempfile
import subprocess
from pathlib import Path
import socket
import ssl

# ======================== 配置常量 ========================
MKCERT_VERSION = "v1.4.4"
DOWNLOAD_BASE = f"https://github.com/FiloSottile/mkcert/releases/download/{MKCERT_VERSION}"
# GitHub 代理列表（按可用性排序）
PROXY_LIST = [
    "https://gh-proxy.org/https://",
    "https://hk.gh-proxy.org/https://",
    "https://cdn.gh-proxy.org/https://"
]
# 下载超时时间（秒）
DOWNLOAD_TIMEOUT = 120

# 进度条长度
PROGRESS_BAR_LENGTH: int = 50

# ======================== 进度条功能（核心新增） ========================
class DownloadProgress:
    """下载进度管理器"""
    def __init__(self):
        self.start_time: float = 0.0
        self.downloaded: int = 0
        self.total: int = 0
        self.last_update: float = 0.0
    
    def format_size(self, size: int) -> str:
        """格式化文件大小（B -> KB/MB/GB）"""
        units = ["B", "KB", "MB", "GB"]
        unit_idx = 0
        while size >= 1024 and unit_idx < len(units) - 1:
            size /= 1024
            unit_idx += 1
        return f"{size:.2f} {units[unit_idx]}"
    
    def format_speed(self, bytes_per_second: float) -> str:
        """格式化下载速度"""
        return self.format_size(int(bytes_per_second)) + "/s"
    
    def update(self, block_num: int, block_size: int, total_size: int) -> None:
        """
        进度更新回调函数
        :param block_num: 已下载块数
        :param block_size: 块大小（字节）
        :param total_size: 总大小（字节）
        """
        # 初始化
        if self.start_time == 0:
            self.start_time = time.time()
            self.downloaded = 0
            self.total = total_size
        
        # 更新已下载大小
        self.downloaded = min(block_num * block_size, total_size)
        
        # 控制更新频率（避免刷屏）
        current_time = time.time()
        if current_time - self.last_update < 0.1 and self.downloaded < self.total:
            return
        self.last_update = current_time
        
        # 计算进度
        if self.total <= 0:
            progress = 0.0
        else:
            progress = self.downloaded / self.total
        
        # 计算耗时和速度
        elapsed = current_time - self.start_time
        if elapsed <= 0 or self.downloaded <= 0:
            speed = 0.0
            eta = 0
        else:
            speed = self.downloaded / elapsed
            eta = int((self.total - self.downloaded) / speed) if speed > 0 else 0
        
        # 构建进度条
        filled_length = int(PROGRESS_BAR_LENGTH * progress)
        progress_bar = "█" * filled_length + "-" * (PROGRESS_BAR_LENGTH - filled_length)
        
        # 格式化输出
        percent = f"{progress * 100:.1f}%"
        downloaded_str = self.format_size(self.downloaded)
        total_str = self.format_size(self.total) if self.total > 0 else "未知"
        speed_str = self.format_speed(speed) if speed > 0 else "0 B/s"
        eta_str = f"{eta}s" if eta > 0 else "∞"
        
        # 输出进度条（覆盖当前行）
        sys.stdout.write(
            f"\r[下载进度] |{progress_bar}| {percent} "
            f"{downloaded_str}/{total_str} "
            f"速度: {speed_str} "
            f"剩余: {eta_str}"
        )
        sys.stdout.flush()
        
        # 下载完成时换行
        if self.downloaded >= self.total and self.total > 0:
            print()  # 换行

# ======================== 输出格式化 ========================
def print_info(msg):
    """打印普通信息"""
    print(f"\033[34m[INFO]\033[0m {msg}")

def print_success(msg):
    """打印成功信息"""
    print(f"\033[32m[SUCCESS]\033[0m {msg}")

def print_error(msg):
    """打印错误信息并退出"""
    print(f"\033[31m[ERROR]\033[0m {msg}")
    sys.exit(1)

def print_warning(msg):
    """打印警告信息"""
    print(f"\033[33m[WARNING]\033[0m {msg}")

# ======================== 系统检测 ========================
def get_system_info():
    """
    检测并获取当前操作系统的标准化信息
    
    该函数使用 platform 模块获取系统信息，并将其标准化为统一格式的元组返回。
    主要用于确定适合当前系统的 mkcert 二进制文件版本和文件扩展名。
    
    返回值:
        tuple: 包含三个元素的元组 (system_type, architecture, file_extension)
            - system_type (str): 标准化的系统类型，值为 "windows" 或 "linux"
            - architecture (str): 标准化的系统架构，可能的值：
                - Windows: "amd64", "arm64"
                - Linux: "amd64", "arm", "arm64"
            - file_extension (str): 可执行文件扩展名，Windows 系统为 "exe"，Linux 系统为空字符串
    
    支持的系统和架构:
        - Windows:
            - x86_64/amd64
            - arm64
        - Linux:
            - x86_64/amd64
            - armv7 系列（如 armv7l）
            - aarch64/arm64
    
    错误处理:
        - 不支持的 Windows 架构会触发错误信息并退出程序
        - 不支持的 Linux 架构会触发错误信息并退出程序
        - Windows 和 Linux 以外的操作系统会触发错误信息并退出程序
    
    示例:
        system_info = get_system_info()
        # 对于 Windows x64 系统，返回: ("windows", "amd64", "exe")
        # 对于 Linux arm64 系统，返回: ("linux", "arm64", "")
        # 对于 macOS 系统，会触发错误："不支持的操作系统: Darwin (仅支持 Windows/Linux)"
    """
    system = platform.system()
    arch = platform.machine().lower()
    
    # Windows 系统
    if system == "Windows":
        if arch in ["amd64", "x86_64"]:
            return "windows", "amd64", "exe"
        elif arch == "arm64":
            return "windows", "arm64", "exe"
        else:
            print_error(f"不支持的 Windows 架构: {arch}")
    
    # Linux 系统
    elif system == "Linux":
        if arch in ["x86_64", "amd64"]:
            return "linux", "amd64", ""
        elif arch.startswith("armv7"):
            return "linux", "arm", ""
        elif arch in ["aarch64", "arm64"]:
            return "linux", "arm64", ""
        else:
            print_error(f"不支持的 Linux 架构: {arch}")
    
    # 其他系统
    else:
        print_error(f"不支持的操作系统: {system} (仅支持 Windows/Linux)")

# ======================== 文件下载 ========================
def download_with_retry(url, save_path):
    """
    下载文件，支持直接下载失败后使用GitHub代理重试
    
    该函数实现了智能下载机制，首先尝试直接下载文件，如果遇到网络限制或超时等问题，
    会自动提供多个GitHub代理选项供用户选择，并使用选定的代理重新尝试下载。
    
    参数:
        url (str): 要下载的文件URL（完整的https链接）
        save_path (str or Path): 下载文件的保存路径，可以是字符串或Path对象
    
    返回值:
        bool: 下载成功返回True，所有下载方式都失败返回False（在某些情况下会直接退出程序）
    
    下载流程:
        1. 尝试直接下载文件
        2. 如果直接下载失败：
            a. 显示下载失败警告
            b. 列出所有可用的GitHub代理地址
            c. 提示用户选择代理序号（支持回车默认选择第一个）
            d. 验证用户输入的合法性
            e. 构建代理URL并使用代理进行下载
        3. 如果使用代理下载也失败：
            a. 打印详细错误信息
            b. 程序退出
    
    注意事项:
        - 代理列表由全局变量PROXY_LIST定义，按可用性排序
        - 下载超时时间由全局变量DOWNLOAD_TIMEOUT控制
        - 直接下载和代理下载都使用了相同的基础下载函数download_file
        - 用户输入验证确保选择的代理序号有效
    
    示例:
        download_url = "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-windows-amd64.exe"
        save_path = Path("mkcert.exe")
        if download_with_retry(download_url, save_path):
            print("下载成功！")
        else:
            print("下载失败！")
    """
    # 1. 尝试直接下载
    print_info(f"尝试直接下载: {url}")
    if download_file(url, save_path):
        return True
    
    # 2. 直接下载失败，使用代理重试
    print_warning("直接下载失败，可能是网络限制，尝试使用 GitHub 代理...")
    print_info("可选代理地址：")
    for i, proxy in enumerate(PROXY_LIST, 1):
        print(f"  {i}. {proxy.rstrip('https://')}")
    
    # 3. 获取用户选择
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
    
    # 4. 构建代理链接并下载
    proxy_prefix: str = PROXY_LIST[choice-1]
    proxy_url: str = proxy_prefix + url.lstrip("https://")
    print_info(f"使用代理下载: {proxy_url}")
    
    if download_file(proxy_url, save_path):
        return True
    else:
        print_error("所有下载方式均失败，请检查网络或稍后重试")

def download_file(url: str, save_path: Path) -> bool:
    """
    基础下载函数（带进度条），带超时和错误处理
    返回: 是否下载成功
    """
    try:
        # 创建忽略 SSL 验证的 opener
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
        urllib.request.install_opener(opener)
        
        # 设置全局超时
        socket.setdefaulttimeout(DOWNLOAD_TIMEOUT)
        
        # 初始化进度条
        progress = DownloadProgress()
        
        # 下载文件（添加进度回调）
        urllib.request.urlretrieve(
            url, 
            str(save_path), 
            reporthook=progress.update  # 进度回调函数
        )
        
        print_success(f"文件下载完成: {save_path.name} ({progress.format_size(progress.total)})")
        return True
    except socket.timeout:
        print_warning(f"\n下载超时（{DOWNLOAD_TIMEOUT}秒）")
        return False
    except Exception as e:
        print_warning(f"\n下载出错: {str(e)[:100]}")
        return False

# ======================== 命令执行 ========================
def run_command(cmd, description):
    """
    执行系统命令，包含详细的日志记录和错误处理机制
    
    该函数封装了subprocess.run，提供了统一的命令执行接口，自动处理命令的输出捕获、
    错误检测和格式化输出，确保命令执行过程的可见性和可维护性。
    
    参数:
        cmd (list): 要执行的命令列表，例如 ["ls", "-la"]
        description (str): 命令的描述信息，用于日志输出和错误提示
    
    返回值:
        subprocess.CompletedProcess: 命令执行成功后的返回对象，包含args、returncode、stdout、stderr等属性
    
    异常处理:
        - subprocess.CalledProcessError: 当命令返回非零退出码时触发，打印错误信息并退出程序
        - Exception: 捕获其他所有异常，打印错误信息并退出程序
    
    执行特点:
        1. 自动将命令列表转换为字符串格式进行日志输出
        2. 设置check=True确保命令执行失败时抛出异常
        3. 捕获标准输出和标准错误信息
        4. 使用UTF-8编码处理输出
        5. 错误信息限制在200个字符以内，避免输出过长
    
    示例:
        # 执行安装命令
        result = run_command(["sudo", "apt-get", "update"], "更新软件包列表")
        
        # 执行创建目录命令
        run_command(["mkdir", "-p", "cert"], "创建证书目录")
        
        # 结果使用
        print(f"命令输出: {result.stdout}")
    """
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

# ======================== 主流程 ========================
    """
    mkcert 自动安装与本地 HTTPS 证书生成工具的主函数
    
    该函数实现了从 mkcert 工具下载、安装到本地 HTTPS 证书生成的完整自动化流程。
    主要适用于需要快速获取本地开发环境 HTTPS 证书的场景，支持 Windows 和 Linux 系统。
    
    主要功能:
        1. 系统信息检测，自动识别操作系统和架构
        2. 自动下载对应系统版本的 mkcert 二进制文件
        3. 支持直接下载和 GitHub 代理下载两种方式
        4. 尝试将 mkcert 安装到系统目录（需要管理员/root 权限）
        5. 初始化 mkcert 根证书
        6. 生成包含 localhost、127.0.0.1 和 ::1 的本地 HTTPS 证书
        7. 整理证书文件到 cert 目录
        8. 提供完成后的使用指引
    
    执行流程:
        1. 打印欢迎信息和分隔线
        2. 调用 get_system_info() 检测当前系统信息
        3. 根据系统信息构建 mkcert 文件名和下载链接
        4. 创建临时目录用于存放下载的 mkcert 二进制文件
        5. 调用 download_with_retry() 下载 mkcert 二进制文件
        6. 为 Linux 系统设置可执行权限
        7. 尝试将 mkcert 安装到系统目录，失败则使用临时路径
        8. 调用 run_command() 执行 mkcert -install 初始化根证书
        9. 调用 run_command() 生成本地 HTTPS 证书
        10. 创建 cert 目录并移动证书文件
        11. 打印完成信息和使用指引
    
    注意事项:
        - Windows 系统需要管理员权限才能安装到系统目录
        - Linux 系统需要 sudo 权限才能安装到 /usr/local/bin
        - 网络连接不稳定时会自动提供 GitHub 代理选项
        - 生成的证书会包含 localhost、127.0.0.1 和 IPv6 地址 ::1
        - 证书文件会被整理到当前目录的 cert 子目录中
    
    使用示例:
        直接运行脚本: python localhost_pem_cert.py
        对于需要管理员权限的系统，可能需要:
        - Windows: 以管理员身份运行命令提示符
        - Linux: sudo python localhost_pem_cert.py
    """
def main():
    BORDER_CHAR = "="
    TITLE_PADDING = 12
    INFO_COLOR = "\033[36m"   # 青色
    TITLE_COLOR = "\033[32m"  # 绿色
    TEXT_COLOR = "\033[37m"   # 白色
    RESET_COLOR = "\033[0m"   # 重置颜色
    
    # 计算边框长度以适配内容
    border_length = 60
    border_line = BORDER_CHAR * border_length
    
    # 打印标题栏
    print(f"\n{TITLE_COLOR}{border_line}{RESET_COLOR}")
    print(f"{TITLE_COLOR}{' ' * TITLE_PADDING}mkcert 自动安装 & 证书生成工具 {RESET_COLOR}")
    print(f"{TITLE_COLOR}{border_line}{RESET_COLOR}")
    
    # 打印功能说明（带缩进和换行）
    print(f"\n{INFO_COLOR}📋 工具说明：{RESET_COLOR}")
    print(f"{TEXT_COLOR}   1. 自动检测系统架构（Windows/Linux amd64/arm64/arm）")
    print(f"   2. 自动下载对应版本的 mkcert 二进制文件")
    print(f"   3. 支持 GitHub 代理下载（解决网络访问问题）")
    print(f"   4. 自动初始化根证书并生成 localhost HTTPS 证书")
    print(f"   5. 自动整理证书文件到 cert 目录{RESET_COLOR}")
    
    # 打印版权和作者信息（居中对齐）
    copyright_text = "© 2024–2025 EndlessPixel Studio. Created by system_mini."
    copyright_padding = (border_length - len(copyright_text)) // 2
    print(f"\n{INFO_COLOR}{' ' * copyright_padding}{copyright_text}{RESET_COLOR}")
    
    print("10s后开始执行...\n按下 Ctrl+C / Command+C 可中止操作。")
    time.sleep(10)  # 短暂等待，提升用户体验
    # 打印开始提示
    print(f"\n{TEXT_COLOR}🚀 开始执行...{RESET_COLOR}\n")
    
    # 1. 检测系统信息
    system, arch, ext = get_system_info()
    print_info(f"检测到系统: {system} ({arch})")
    # 2. 构建文件名和下载链接
    filename = f"mkcert-{MKCERT_VERSION}-{system}-{arch}"
    if ext:
        filename += f".{ext}"
    download_url = f"{DOWNLOAD_BASE}/{filename}"
    
    # 3. 创建临时目录
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_file = Path(temp_dir) / filename
        
        # 4. 下载 mkcert 二进制文件
        if not download_with_retry(download_url, temp_file):
            sys.exit(1)
        
        # 5. 设置可执行权限（Linux）
        if system == "Linux":
            temp_file.chmod(0o755)
        
        # 6. 安装 mkcert（优先系统目录，失败则用临时文件）
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
        
        # 7. 初始化根证书
        run_command([mkcert_path, "-install"], "初始化根证书")
        
        # 8. 生成本地 HTTPS 证书
        run_command(
            [mkcert_path, "localhost", "127.0.0.1", "::1"],
            "生成本地证书"
        )
        
        # 9. 整理证书文件
        cert_dir = Path("cert")
        cert_dir.mkdir(exist_ok=True)
        
        for cert_file in ["localhost.pem", "localhost-key.pem"]:
            file_path = Path(cert_file)
            if file_path.exists():
                dest_path = cert_dir / cert_file
                shutil.move(file_path, dest_path)
                print_info(f"证书已移动到: {dest_path}")
    
    # 10. 完成提示
    print("\n" + "=" * 50)
    print_success("证书生成完成！")
    print_info(f"证书目录: {Path.cwd() / 'cert'}")
    print_info("下一步可执行: npm run dev-https")
    print("=" * 50)

if __name__ == "__main__":
    # 检查 Python 版本
    if sys.version_info < (3, 6):
        print_error("需要 Python 3.6 及以上版本")
    
    # 运行主程序
    try:
        main()
    except KeyboardInterrupt:
        print("\n" + print_warning("用户中断操作"))
        sys.exit(0)
    except Exception as e:
        print_error(f"程序异常退出: {str(e)}")