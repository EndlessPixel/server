import { PageLayout, PageHeader, ContentContainer } from "@/components/page-layout";

export const metadata = {
  title: "用户协议 - EndlessPixel",
  description: "EndlessPixel 服务器使用条款与用户行为规范。",
};

export default function TermsPage() {
  return (
    <PageLayout>
      <ContentContainer>
        <PageHeader
          title="用户协议"
          description="本协议是您与 EndlessPixel 运营团队之间就使用本服务器及相关网站服务所达成的约定。使用本服务即表示您已阅读、理解并接受本协议全部内容。"
        />

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">一、账号与注册</h2>
            <p>
              本服务器暂不支持网页注册，您需先在游戏内加入服务器，使用注册指令创建账号。账号的所有权归您本人，请妥善保管密码，因密码泄露导致的损失由您自行承担。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">二、行为规范</h2>
            <p>
              您在使用服务器时，不得有以下行为：使用外挂、作弊客户端或修改游戏内存；刷屏、人身攻击、发布歧视或违法言论；恶意破坏他人建筑或服务器设施；利用漏洞牟利或影响其他玩家体验。一经发现，运营团队有权对账号进行警告、封禁 IP 或永久封停等处理。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">三、内容与知识产权</h2>
            <p>
              您在服务器内创作的内容（建筑、作品等）其著作权归您所有，但您授权运营团队为运营、展示之目的免费使用。服务器本身的程序、素材及网站设计版权归相应权利人所有。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">四、服务变更与免责</h2>
            <p>
              本服务器为爱好者非营利项目，可能随时调整、暂停或终止部分功能，且不保证服务不间断。对于因网络、不可抗力或第三方原因造成的损失，运营团队不承担责任。游戏内容、账号数据不构成任何现实财产。
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">五、未成年人提示</h2>
            <p>
              若您未满 18 周岁，请在监护人陪同下使用本服务，并注意控制游戏时长。
            </p>
          </section>

          <section>
            <p>
              本协议最终解释权归 EndlessPixel 运营团队所有。如条款变更，将在网站公告，继续使用视为接受变更后的条款。
            </p>
          </section>
        </div>
      </ContentContainer>
    </PageLayout>
  );
}
