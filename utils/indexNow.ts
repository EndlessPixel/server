// utils/indexNow.ts
/**
 * 提交URL到必应IndexNow（纯原生Fetch实现，零TS错误，适配endlesspixel.fun）
 * 修复点：确保所有return在函数体内，文件为合法ES模块
 */
export async function submitToIndexNow(urls: string[]): Promise<{ success: boolean; message?: string }> {
    // 从环境变量读取配置（无硬编码兜底，强制要求配置）
    const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
    const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;
    const INDEXNOW_ENDPOINT = 'https://www.bing.com/indexnow';
    const REQUEST_TIMEOUT = 10000; // 10秒超时

    // 1. 基础参数校验（所有return都在函数体内）
    if (!INDEXNOW_KEY) {
        const msg = '❌ IndexNow配置错误：缺少INDEXNOW_KEY环境变量';
        console.error(msg);
        return { success: false, message: msg };
    }

    if (!NEXT_PUBLIC_APP_URL) {
        const msg = '❌ IndexNow配置错误：缺少NEXT_PUBLIC_APP_URL环境变量';
        console.error(msg);
        return { success: false, message: msg };
    }

    if (!urls || urls.length === 0) {
        const msg = '❌ IndexNow提交失败：URL列表为空';
        console.error(msg);
        return { success: false, message: msg };
    }

    if (urls.length > 1000) {
        const msg = '❌ IndexNow提交失败：单次最多提交1000个URL，请分批提交';
        console.error(msg);
        return { success: false, message: msg };
    }

    // 2. 仅生产环境执行提交
    if (process.env.NODE_ENV !== 'production') {
        const msg = `🔧 开发环境跳过IndexNow提交：共${urls.length}个URL`;
        console.log(msg);
        return { success: true, message: msg };
    }

    try {
        // 3. 构建请求体
        const requestBody = JSON.stringify({
            host: NEXT_PUBLIC_APP_URL,
            key: INDEXNOW_KEY,
            keyLocation: `${NEXT_PUBLIC_APP_URL}/${INDEXNOW_KEY}.txt`,
            urlList: urls
        });

        // 4. 构建fetch请求（标准TS类型）
        const fetchRequest = fetch(INDEXNOW_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'User-Agent': 'Next.js/IndexNow (endlesspixel.fun)'
            },
            body: requestBody
        });

        // 5. 实现标准超时逻辑
        const timeoutPromise = new Promise<Response>((_, reject) => {
            setTimeout(() => {
                reject(new Error(`请求超时（${REQUEST_TIMEOUT}ms）`));
            }, REQUEST_TIMEOUT);
        });

        // 6. 竞态执行
        const response = await Promise.race([fetchRequest, timeoutPromise]);

        // 7. 处理响应
        if (response.ok) {
            const msg = `✅ IndexNow提交成功（endlesspixel.fun）：共提交${urls.length}个URL`;
            console.log(msg);
            return { success: true, message: msg };
        } else {
            const errorText = await response.text();
            const msg = `❌ IndexNow提交失败：HTTP${response.status} - ${errorText}`;
            console.error(msg);
            return { success: false, message: msg };
        }
    } catch (error) {
        const msg = `❌ IndexNow提交异常：${(error as Error).message}`;
        console.error(msg);
        return { success: false, message: msg };
    }
}