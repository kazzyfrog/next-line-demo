import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  Check,
  Clock,
  Code,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: "📚",
    title: "豊富なカリキュラム",
    description:
      "初心者から上級者まで、幅広いスキルレベルに対応したプログラミング学習コンテンツを提供しています。実践的なプロジェクトを通じて、実務で役立つスキルを身につけることができます。",
    color: "border-blue-500",
  },
  {
    icon: "💚",
    title: "徹底したサポート",
    description:
      "経験豊富な講師陣が、あなたの学習を丁寧にサポート。つまずいたときも、すぐに質問できる環境を整えています。学習の進捗に合わせた個別カウンセリングも実施しています。",
    color: "border-purple-500",
  },
  {
    icon: "🤝",
    title: "充実したコミュニティ",
    description:
      "同じ目標を持つ仲間と繋がり、モチベーションを高め合えるコミュニティを提供。卒業後も継続的な交流の場があり、貴重な人脈を築くことができます。",
    color: "border-green-500",
  },
];

const features = [
  "フルスタックWeb開発カリキュラム",
  "講師によるライブコーディングセッション",
  "個人プロジェクトポートフォリオ作成",
  "1対1のメンタリングセッション",
  "無期限の就職サポート",
];

const navLinks = [
  { href: "#benefits", label: "サービスの特徴" },
  { href: "#pricing", label: "料金・プラン" },
  { href: "#process", label: "入会の流れ" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <BenefitsSection />
      <PricingSection />
      <CounselingSection />
      <ProcessSection />
      <LineCta />
      <Footer />
    </div>
  );
}

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            <span className="text-xl font-bold">Blueberry Academy</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            asChild
            size={"lg"}
            className="bg-green-500 hover:bg-green-500/90 font-semibold"
          >
            <Link target="_blank" href="https://lin.ee/JrmeYEO">
              <Plus className="mr-1" />
              LINEから追加
            </Link>
          </Button>
          <Button size={"lg"} className="font-semibold">
            <CalendarPlus className="mr-1" />
            無料カウンセリング
          </Button>
        </div>
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative flex min-h-[90vh] items-end justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Programmers working together"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="container relative z-10 flex flex-col mt-24 space-y-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          世の中のニーズを、
          <br />
          形にする開発スキル。
        </h1>

        <div className="flex gap-4 flex-col max-w-sm">
          <Button
            variant={"secondary"}
            size="lg"
            className="text-lg py-8 font-semibold bg-white text-black"
          >
            <CalendarPlus className="mr-2 h-5 w-5" />
            無料カウンセリングを申し込む
          </Button>
          <Button
            size="lg"
            className="text-lg py-8 font-semibold text-white bg-green-500 hover:bg-green-500/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            LINEでお知らせを受け取る
          </Button>
        </div>
        <div className="animate-bounce mx-auto pt-16">
          <ArrowRight className="h-10 w-10 rotate-90 text-white/70" />
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  return (
    <section className="py-32 bg-white" id="benefits">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16">
          <span className="relative inline-block">
            Blueberry Academy が選ばれる「3つの理由」
            <span className="absolute bottom-0 left-0 w-full h-2 bg-purple-500 opacity-30"></span>
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`border-l-4 ${benefit.color} pl-6 transition-all duration-300 hover:pl-8`}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex items-center text-4xl justify-center w-20 h-20 bg-gray-100 rounded-full">
                  {/* 0{index + 1} */}
                  {benefit.icon}
                </span>
              </div>
              <div className="flex items-center justify- gap-3 mb-4">
                <div className="rounded-full p-2 bg-gray-">0{index + 1}</div>
                <h3 className="text-2xl font-bold">{benefit.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  return (
    <section className="py-20 bg-gray-50" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-center mb-4">
            <span className="relative inline-block">
              利用料
              <span className="absolute bottom-0 left-0 w-full h-2 bg-green-500 opacity-30"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            追加料金や隠れたコストはありません。
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-baseline justify-center mt-4">
                <span className="text-5xl font-bold">¥198,000</span>
                <span className="ml-2 text-gray-500">/ 12週間</span>
              </div>
              <p className="text-center text-gray-500 mt-2">
                分割払いも可能: 月々¥16,500 x 12回
              </p>
            </div>

            <div className="p-8">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors">
                  今すぐ申し込む
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                1週間の100%返金保証
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CounselingSection = () => {
  return (
    <section
      className="py-16 bg-black text-white relative overflow-hidden"
      id="counseling"
    >
      {/* 背景イメージ (プレースホルダー) */}
      <div className="absolute inset-0 opacity-20 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-black"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 左側: 特徴と利点 */}

          <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
            <div className="mb-12">
              <h2 className="text-5xl font-bold text- mb-4">
                無料カウンセリングへ
                <br />
                ご参加ください！
              </h2>
              <div className="h-1 w-32 bg-blue-500 mx- mb-6"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-6 text-blue-400">
              ざっくばらんに、オンラインで相談！
            </h3>

            <ul className="space-y-6">
              <li className="flex items-center">
                <div className="bg-blue-500/60 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">📝</span>
                </div>

                <h4 className="font-medium text-lg">
                  サービス内容を詳しく聞きたい
                </h4>
              </li>
              <li className="flex items-center">
                <div className="bg-blue-500/60 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">🤔</span>
                </div>
                <h4 className="font-medium text-lg">
                  自分に向いているかわからない
                </h4>
              </li>
              <li className="flex items-center">
                <div className="bg-blue-500/60 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">⭐️</span>
                </div>
                <h4 className="font-medium text-lg">入会を検討している</h4>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-700 flex items-center">
              <Clock className="h-6 w-6 text-blue-400 mr-3" />
              <span className="text-gray-300">リアルタイムで疑問を解消</span>
            </div>
          </div>

          {/* 右側: フォーム */}
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    お名前
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="山田 太郎"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    メールアドレス
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="goals"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ご希望・ご質問
                  </label>
                  <textarea
                    id="goals"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-28"
                    placeholder="プログラミングを学ぶ目的や、ご質問などをお聞かせください"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
                >
                  カウンセリングを予約する
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>
                  30分程度のオンライン面談です。ご希望の日時を調整いたします。
                </p>
                <p className="mt-2">※完全無料・入会義務はありません</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  return (
    <section id="process" className="py-20 bg-background">
      <div className="container mx-auto">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          <span className="relative inline-block">
            入会の流れ
            <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-500 opacity-30"></span>
          </span>
        </h2>
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-muted-foreground/30 md:left-1/2" />

            {/* Step 1 */}
            <div className="relative mb-12">
              <div className="flex flex-col md:flex-row">
                <div className="mb-6 flex md:w-1/2 md:pr-8 md:text-right">
                  <div className="md:ml-auto">
                    <h3 className="text-2xl flex gap-4 justify-end items-center font-bold mb-4">
                      <span className="flex items-center text-4xl justify-center w-20 h-20 bg-gray-100 rounded-full">
                        📆
                      </span>
                      お申し込み
                    </h3>
                    <p className="text-muted-foreground">
                      Web 上、もしくは公式LINEから
                      <br />
                      お申し込みできます。
                    </p>
                  </div>
                </div>
                <div className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-1/2 md:-ml-4">
                  1
                </div>
                <div className="md:w-1/2 md:pl-8" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative mb-12">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 md:pr-8" />
                <div className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-1/2 md:-ml-4">
                  2
                </div>
                <div className="mb-6 flex md:w-1/2 md:pl-8">
                  <div>
                    <h3 className="text-2xl flex gap-4 items-center font-bold mb-4">
                      カウンセリング
                      <span className="flex items-center text-4xl justify-center w-20 h-20 bg-gray-100 rounded-full">
                        🔍
                      </span>
                    </h3>
                    <p className="text-muted-foreground">
                      専門スタッフとの面談で、あなたの目標に合わせてカリキュラムを調整し、ご提案します。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative mb-12">
              <div className="flex flex-col md:flex-row">
                <div className="mb-6 flex md:w-1/2 md:pr-8 md:text-right">
                  <div className="md:ml-auto">
                    <h3 className="text-2xl flex gap-4 justify-end items-center font-bold mb-4">
                      <span className="flex items-center text-4xl justify-center w-20 h-20 bg-gray-100 rounded-full">
                        ⚙️
                      </span>
                      開発の準備を整える
                    </h3>
                    <p className="text-muted-foreground">
                      学習カリキュラム・教材にアクセスし、
                      <br />
                      Web開発の旅に向けた準備を整えましょう。
                    </p>
                  </div>
                </div>
                <div className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-1/2 md:-ml-4">
                  3
                </div>
                <div className="md:w-1/2 md:pl-8" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 md:pr-8" />
                <div className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-1/2 md:-ml-4">
                  4
                </div>
                <div className="mb-6 flex md:w-1/2 md:pl-8">
                  <div>
                    <h3 className="text-2xl flex gap-4 items-center font-bold mb-4">
                      学習を開始する
                      <span className="flex items-center text-4xl justify-center w-20 h-20 bg-gray-100 rounded-full">
                        🚀
                      </span>
                    </h3>
                    <p className="text-muted-foreground">
                      仲間の生徒やメンターと繋がり、
                      <br />
                      コミュニティで学習を深めましょう。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <span className="text-lg font-bold">Blueberry Academy</span>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          created by @your-handle &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

const LineCta = () => {
  return (
    <section className="py-16 relative overflow-hidden" id="line">
      {/* Gradient Background with Pattern */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 z-0"
        aria-hidden="true"
      />

      {/* Decorative Dots Pattern */}
      <div className="absolute inset-0 z-0 opacity-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(white 2px, transparent 2px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* LINE Logo Shape (Simplified) */}
      <div
        className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-white opacity-5 z-0"
        aria-hidden="true"
      ></div>
      <div
        className="absolute -left-32 -top-32 w-64 h-64 rounded-full bg-white opacity-5 z-0"
        aria-hidden="true"
      ></div>

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* LINE Logo (SVG) */}

          <h2 className="text-2xl md:text-5xl font-bold text-white">
            公式LINEを追加して
            <br />
            最新情報を受け取る
          </h2>

          <p className="text-white/90 text-base md:text-lg leading-relaxed">
            LINE公式アカウントを友だち登録いただくと、
            <br className="hidden md:block" />
            エントリー開始のお知らせ、更新情報などを定期的に配信します。
          </p>
          <div className="">
            <button className="bg-white text-green-600 hover:bg-white/90 text-base md:text-lg px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center mx-auto">
              今すぐ友だち追加
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
