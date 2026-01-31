"use client";
import { useState } from "react";

const NEW_WIKI_URL = "https://docs.qq.com/aio/p/sc0m6qoo8xschku?p=7OQN4lhJjGdrbLfHXNz7rs";

function FullScreenPreview() {
    const [, setIsLoading] = useState(true);
    return (
        // 外层容器撑满视口，清边距
        <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
            <iframe
                src={NEW_WIKI_URL}
                title="EndlessPixel 最新Wiki-腾讯文档"
                width="100%"
                // 1. 用style写height，数值生效；2. 100%继承外层100vh
                style={{ height: "100%", border: "none" }}
                onLoad={() => setIsLoading(false)}
                className="transition-opacity duration-300"
                allow="fullscreen; popups; clipboard-write"
            />
        </div>
    );
}

export default FullScreenPreview;