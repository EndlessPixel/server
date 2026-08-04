import { PageLayout, PageHeader, ContentContainer } from "@/components/page-layout";

export const metadata = {
  title: "隐私政策 - EndlessPixel",
  description: "EndlessPixel 网站及服务器如何收集、使用与保护您的个人信息。",
};

export default function PrivacyPage() {
  return (
    <PageLayout>
      <ContentContainer>
        <PageHeader
          title="隐私政策"
          description="我们重视您的隐私。本政策说明 EndlessPixel 网站及服务器会收集哪些信息、如何使用以及您拥有的权利。"
        />

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">一、我们收集的信息</h2>
            <p>
              登录时：您输入的用户名与密码。密码会在传输前按约定方式加密，服务器仅保存加密后的结果，我们无法获知您的明文密码。使用服务时：为提供联机功能，我们会记录您的游戏内 ID、登录 IP 及大致地理位置（仅到城市级别），以及服务器运营所需的游戏数据（如背包、位置等）。您主动填写的资料（如 QQ 号）仅在您提供时收集。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">二、信息的使用</h2>
            <p>
              上述信息仅用于：验证您的身份并完成登录；保障服务器安全、排查异常与作弊；在个人中心向您展示属于自己的数据。我们不会将您的个人信息出售给第三方。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">三、信息的共享</h2>
            <p>
              除法律法规要求、或为保护本服务器及用户安全所必需外，我们不会向第三方披露您的个人信息。统计分析可能使用匿名化、聚合后的数据。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">四、Cookie 与会话</h2>
            <p>
              登录后我们会在您的浏览器写入会话 Cookie（HttpOnly，无法被网页脚本读取），用于保持登录状态。清除该 Cookie 即视为退出登录。我们不会利用 Cookie 追踪您在其它网站的浏览行为。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">五、您的权利</h2>
            <p>
              您可随时退出登录；如需删除个人资料或注销账号，可联系运营团队。我们会在合理期限内处理您的请求。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">六、联系方式</h2>
            <p>
              如对本政策有疑问，可通过网站公告的社群渠道与我们联系。
            </p>
          </section>
        </div>
      </ContentContainer>
    </PageLayout>
  );
}
