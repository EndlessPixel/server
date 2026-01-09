// utils/indexNow.ts（调试版，增加详细日志）
export async function submitToIndexNow(urls: string[]): Promise<{ success: boolean; message?: string }> {
    try {
        console.log('🔍 IndexNow调试日志 - 环境变量：', {
            INDEXNOW_KEY: process.env.INDEXNOW_KEY ? '已配置' : '未配置',
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? '已配置' : '未配置',
            NODE_ENV: process.env.NODE_ENV
        });

        const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
        const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;
        const INDEXNOW_ENDPOINT = 'https://www.bing.com/indexnow';
        const REQUEST_TIMEOUT = 10000;

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
            const msg = '❌ IndexNow提交失败：单次最多提交1000个URL';
            console.error(msg);
            return { success: false, message: msg };
        }

        if (process.env.NODE_ENV !== 'production') {
            const msg = `🔧 开发环境跳过IndexNow提交：共${urls.length}个URL`;
            console.log(msg);
            return { success: true, message: msg };
        }

        // 生产环境提交逻辑（开发环境不会执行到这里）
        const requestBody = JSON.stringify({
            host: NEXT_PUBLIC_APP_URL,
            key: INDEXNOW_KEY,
            keyLocation: `${NEXT_PUBLIC_APP_URL}/${INDEXNOW_KEY}.txt`,
            urlList: urls
        });
        console.log('🔍 IndexNow调试日志 - 请求体：', requestBody);

        const fetchRequest = fetch(INDEXNOW_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'User-Agent': 'Next.js/IndexNow (endlesspixel.fun)'
            },
            body: requestBody
        });

        const timeoutPromise = new Promise<Response>((_, reject) => {
            setTimeout(() => {
                reject(new Error(`请求超时（${REQUEST_TIMEOUT}ms）`));
            }, REQUEST_TIMEOUT);
        });

        const response = await Promise.race([fetchRequest, timeoutPromise]);
        console.log('🔍 IndexNow调试日志 - 响应状态：', response.status);

        if (response.ok) {
            const msg = `✅ IndexNow提交成功：共提交${urls.length}个URL`;
            console.log(msg);
            return { success: true, message: msg };
        } else {
            const errorText = await response.text();
            const msg = `❌ IndexNow提交失败：HTTP${response.status} - ${errorText}`;
            console.error(msg);
            return { success: false, message: msg };
        }
    } catch (error) {
        // 捕获所有异常并打印详细信息
        console.error('❌ IndexNow致命错误：', error);
        const msg = `❌ IndexNow提交异常：${(error as Error).message}`;
        return { success: false, message: msg };
    }
}