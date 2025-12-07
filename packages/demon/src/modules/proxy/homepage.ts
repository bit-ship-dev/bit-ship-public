// eslint-disable max-lines-per-function
export const homepage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="icon" type="image/png" sizes="16x16" href="https://www.bit-ship.dev/favicon/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="https://www.bit-ship.dev/favicon/favicon-32x32.png">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
  <title>Bit-Ship Demon</title>
  <style>
    ${getStyles()}
  </style>
</head>
<body>
<div class="wrapper">
  <div>
    <img width="250px" src="https://www.bit-ship.dev/logo.png"/>
    <div class="projects">
      
    </div>
    <p style="font-size: 20px; width: 600px; margin-bottom: 50px">
      Hi from Bit-Ship demon! Run following command to stop the demon:
      <code style="color: orange">bit-ship demon stop</code>
    </p>
    <a class="app-button" href="https://www.bit-ship.dev/docs">Docs</a>
    <a class="app-button" href="https://app.bit-ship.dev">Bit-Ship app</a>
  </div>
</div>
</body>
</html>
`

function getStyles() {
  return `
     html, body {
      padding: 0;
      margin: 0;
    }
    body{
      background: #222222;
      color: white;
      font-family: "DM Sans", sans-serif;
      font-optical-sizing: auto;
      font-weight: <weight>;
      font-style: normal;
      text-align: center;
    }
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      width: 100vw;
    }
    .app-button {
      background: white;
      padding: 10px 20px;
      margin-top: 40px;
      border-radius: 20px;
      color: black;
      text-decoration: none;
    }
    .projects {
      display: flex;
      margin-top: 10px;
      justify-content: center;
      align-items: center;
      .project {
        background: #444444;
        min-width: 400px;
        border-radius: 10px;
        padding: 15px 20px;
        text-align: left;
        margin: 10px;
        width: 100%;
        h2 {
          line-height: 0;
        }
        a {
          color: orange;
          text-decoration: none;
        }
      }
    }
  `
}
