function HeroSection() {
  const name = localStorage.getItem("name") || "User";

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div
      className="
      max-w-7xl
      mx-auto
      mt-8
      px-6
      "
    >
      <div
        className="
        bg-gradient-to-r
        from-blue-600
        via-cyan-600
        to-blue-700
        rounded-3xl
        shadow-2xl
        p-10
        text-white
        flex
        flex-col
        md:flex-row
        justify-between
        items-center
        "
      >
        <div>
          <h2
            className="
            text-5xl
            font-bold
            mb-4
            "
          >
            👋 {greeting},
          </h2>

          <h1
            className="
            text-4xl
            font-extrabold
            "
          >
            {name}
          </h1>

          <p
            className="
            mt-5
            text-xl
            opacity-90
            "
          >
            Your Personal AI Healthcare Assistant
          </p>

          <p className="mt-2">Stay Healthy • Stay Safe • Stay Connected</p>
        </div>

        <div
          className="
          text-9xl
          mt-10
          md:mt-0
          animate-pulse
          "
        >
          🩺
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
