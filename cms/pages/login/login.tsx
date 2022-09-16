import React from "react";

const Login = () => {
  const receiveMessage = (event: any) => {
    const { token, provider } = JSON.parse(event.data) as {
      token: string;
      provider: "github";
    };
    document.cookie = `token=${token};`;
    document.cookie = `provider=${provider};`;
  };

  const openWindow = () => {
    const w = 700;
    const h = 700;
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;

    window.open(
      `/api/auth?provider=github`,
      "Twitter Login",
      `
        height=${h},
        width=${w},
        top=${top / 2},
        left=${left}
      `
    );
  };

  React.useEffect(() => {
    window.addEventListener("message", receiveMessage, false);
    return window.removeEventListener("message", receiveMessage);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button onClick={openWindow}>Login with Github</button>
    </div>
  );
};

export default Login;
