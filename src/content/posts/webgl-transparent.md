---
title: WebGL渲染双通道mp4视频展示透明特效
date: 2026-08-13T13:18:54.077Z
summary: 直播间的特效是怎么实现的？看完本文你将理解其中的奥秘。
category: 实操教程
tags: [guide]
---

透明底视频（带 Alpha 通道的视频）能够在播放时露出下层的网页、UI或其他视频背景，广泛应用于**直播特效**、动效UI、特效合成等场景。

## 一、 双通道mp4透明视频实现原理

普通mp4视频仅包含RGB（红、绿、蓝）三个色彩通道，每个像素点只记录“颜色信息”，默认完全不透明。透明底视频在RGB的基础上增加了一个**Alpha（透明度）通道**，黑色表示全透明（Opacity=0），白色表示不透明，形成**RGBA**视图结构（左右双通道拼接示例）：

![](/posts/rgb+alpha.png 'RGB+Alpha混合')

> 腾讯的[vap动画组件](https://github.com/Tencent/vap/blob/master/Introduction.md)、YY直播的[YYEVA](https://github.com/yylive/YYEVA)动态特效，也是双通道mp4视频合并转换方案的封装和扩展。
>
> 腾讯针对AE的动效工作流解决方案[PAG](https://pag.io/)（Portable Animated Graphics），支持运行时编辑。已应用于QQ等应用开屏动画、直播特效、年度总结动画等场景。

此时你可能发出疑问：为什么不直接使用原本就支持透明的视频或动图？且看下文详解。

## 二、原生格式对比

并非所有图片、视频封装格式都支持Alpha通道。常见的支持透明的视频格式和图片格式对比如下。

#### 视频

web端、app展示重点需要**高兼容性、高压缩率、动效流畅与小体积**，主要用于网页 UI 交互、App 内礼物动效、游戏UI等网络传输场景。因此硬解优于软解、跨平台优于私有，同时在尽可能保留细节的同时压缩文件体积。对比下列原生就支持透明通道的视频格式，使用mp4双通道视频合成透明底视频则是目前最优解。

> - 软解（软件解码）：由CPU运行通用软件程序来解压视频。兼容性强，几乎能解所有格式；但CPU占用高、设备容易发烫耗电，处理高码率4K/8K视频时易卡顿。
> - 硬解（硬件解码）：由GPU或芯片内置的专用解码电路直接处理。计算效率极高、CPU占用极低，播放流畅且省电；但灵活性差仅支持出厂固化的特定格式。

| 文件格式    | 编码                | 解码                | 支持透明 | 优点                                                       | 缺点                                                             | 常见应用场景                                                   |
| ----------- | :------------------ | ------------------- | -------- | ---------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| WebM        | VP8 / VP9           | 软解 / 部分硬解     | 是       | 体积小、，支持边缘半透明羽化，在主流浏览器上支持好         | Safari 和iOS生态不支持透明、老旧低端设备解码CPU开销较大          | Android客户端、Web网页透明视频/特效                            |
| MOV         | ap4h/ap4x           | 软解(Apple硬件加速) | 是       | 近无损画质，保留极致的影调与透明度细节，剪辑软件解码开销小 | 体积极大                                                         | 剪辑/CG特效素材、绿幕抠像后期合成、电视广告/电影母带导出       |
| MP4 / MOV   | HEVC(H.265) + Alpha | 硬解 (Apple)        | 是       | 苹果原生，在iOS/Mac上播放流畅、体积小画质高                | 属于Apple私有扩展，Windows、Android及Chrome无法直接识别Alpha     | iOS App UI 动效、Safari 网页透明视频、Apple Vision Pro 交互    |
| **标准MP4** | **H.264 / AVC**     | **硬解**            | **否**   | **全平台100%兼容，网络传输效率极佳**                       | **原生完全不支持透明通道，透明区域会被强制填充为黑色或白色背景** | **常规全屏视频、不含透明底的背景动画、通用网络视频播放与推流** |

#### 动态图片

APNG/GIF图片动效采用逐帧存储模式体积普遍较大，因此只适合微型/短小UI动效。WebP/AVIF利用帧间压缩，可用于一些长时间动效；

但图片依赖CPU软解，内存开销极高，且在相似的表现程度时，mp4视频文件大小要远小于图片，因此双通道MP4仍是更优方案。

| 格式         | 文件大小      | 解码           | 特效支持度 | 优点                                                    | 缺点                                                   | 常见应用场景                                |
| ------------ | ------------- | -------------- | ---------- | ------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------- |
| APNG         | 极大          | 软解           | 高         | 画面无损，画质极高，全平台100%极佳兼容                  | 体积巨大，内存解压占用高                               | 像素级高级透明、精细UI微动效                |
| GIF          | 中等/较大     | 软解           | 极低       | 兼容性100%，无任何生态与老旧设备门槛                    | 仅1位透明、无半透明、限256色，边缘有锯齿白边           | 社交软件基础表情包、极简演示短图            |
| AVIF         | 极小          | 软解(部分硬解) | 高         | 当前压缩率最高的前沿格式，支持高色彩深度 (HDR) 与透明底 | 部分老旧系统/WebView未支持                             | 小体积Web透明Banner/图标                    |
| WebP         | 较小          | 软解           | 高         | 压缩率高，体积小，支持渐变半透明，现代浏览器全面支持    | 长帧数下内存开销仍较大                                 | 小型透明微动效、动态表情包                  |
| Lottie(矢量) | 极小/导出受限 | 软解           | 中低       | 矢量无限放大不模糊/失真、体积小到极致                   | 无法导出复杂粒子、流体及 3D，节点过多时极其吃 CPU/内存 | 矢量按钮反馈、Loading动效、引导页矢量小插画 |

## 三、Web端跨平台兼容解决方案

### HTML5多源标签（原生兼容）

由于各种透明视频格式对不同平台的兼容性不同，最简单的方式是直接在 `<video>` 中配置多个 `<source>`，让浏览器自动选择原生支持的透明格式：

```html
<video autoplay loop muted playsinline>
  <!-- Safari / iOS 优先加载 HEVC 透明 MP4 -->
  <source src="transp_hevc.mp4" type="video/mp4; codecs=hvc1" />
  <!-- Chrome / Firefox / Android 加载 WebM -->
  <source src="transp_vp9.webm" type="video/webm" />
</video>
```

这种方案无需任何前端 JavaScript 处理渲染，开箱即用。缺点是同一动效必须导出并维护不同格式的视频，且部分旧设备有时依然会把透明底渲染成黑色背景。

### Canvas / WebGL拼接双通道

由于H.264 MP4拥有全局最高级别的硬解支持，这种方案能保证在iOS、Android、PC甚至各类嵌软 WebView 中呈现完全一致的效果，拥有绝对的兼容安全感（如电商大促活动页、直播间千机千面的特效礼物，不允许任何用户看到黑底）。

- **2D Canvas方案**：使用 `getImageData` 循环处理像素点，适合代码简短或要求不高的场景。

- **WebGL方案**：使用Shader进行GPU硬件加速，性能极高，CPU占用极低，适合移动端与高帧率动画。

## 四、使用WebGL渲染左右双通道展示透明视频

### 视频资源结构说明

输入的 MP4 视频帧格式示意（示例视频分辨率为 720 * 360）：

<video src="/posts/transp.mp4" autoplay loop muted playsinline width="100%"></video>

- 左半部分（0 ~ 360px）：原始RGB色彩
- 右半部分（360 ~ 720px）：灰度Alpha遮罩（白色=不透明，黑色=透明，灰色=半透明）

**左右双通道MP4视频本质上是一个标准的不透明视频**，只是用了黑白颜色来存储alpha通道的值。通用视频播放器都只会将它识别为普通视频，直接展示左彩右黑白的画面。

### 在html中使用

`index.html`

```html
<body>
  <!-- 展示容器 -->
  <div class="preview-box">
    <canvas id="webgl-canvas" width="360" height="360"></canvas>
  </div>

  <!-- 顶点着色器 (Vertex Shader) -->
  <script id="vs" type="x-shader/x-vertex">
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  </script>

  <!-- 片元着色器 (Fragment Shader) -->
  <script id="fs" type="x-shader/x-fragment">
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_videoTexture;

    void main() {
      // 1. 采样左半部分 (RGB 颜色): X 轴映射到 [0.0, 0.5]
      vec2 rgbUV = vec2(v_texCoord.x * 0.5, v_texCoord.y);
      vec3 rgb = texture2D(u_videoTexture, rgbUV).rgb;

      // 2. 采样右半部分 (Alpha 遮罩): X 轴映射到 [0.5, 1.0]
      vec2 alphaUV = vec2(v_texCoord.x * 0.5 + 0.5, v_texCoord.y);
      float alpha = texture2D(u_videoTexture, alphaUV).r;

      // 3. 输出预乘或包含 Alpha 的颜色，透传给 CSS 层进行混合
      gl_FragColor = vec4(rgb, alpha);
    }
  </script>

  <script>
    const canvas = document.getElementById('webgl-canvas')
    // 获取 context 时确保 alpha 为 true (默认即为 true)
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })

    if (!gl) {
      alert('你的浏览器不支持 WebGL')
    }

    // 开启 WebGL 原生混合模式
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // 1. 创建视频元素并加载 MP4
    const video = document.createElement('video')
    video.src = 'transp.mp4'
    video.loop = true
    video.muted = true
    video.crossOrigin = 'anonymous'
    video.playsInline = true
    // 预加载视频，确保 readyState 能够快速达到 HAVE_CURRENT_DATA
    video.load()

    // 2. 编译 Shader 辅助函数
    function createShader(gl, type, source) {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader 编译失败:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vsSource = document.getElementById('vs').text
    const fsSource = document.getElementById('fs').text
    const program = gl.createProgram()
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource))
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource))
    gl.linkProgram(program)
    gl.useProgram(program)

    // 3. 传入全屏矩形顶点数据及 UV 纹理坐标
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const vertices = new Float32Array([-1, 1, 0, 0, -1, -1, 0, 1, 1, 1, 1, 0, 1, -1, 1, 1])
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const FSIZE = vertices.BYTES_PER_ELEMENT
    const a_position = gl.getAttribLocation(program, 'a_position')
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE * 4, 0)
    gl.enableVertexAttribArray(a_position)

    const a_texCoord = gl.getAttribLocation(program, 'a_texCoord')
    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
    gl.enableVertexAttribArray(a_texCoord)

    // 4. 配置视频纹理
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    // 5. 渲染循环
    function render() {
      gl.clearColor(0.0, 0.0, 0.0, 0.0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // 只要视频准备好了当前帧，就更新纹理并绘制
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        // 刷新视频帧到 WebGL 纹理
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      requestAnimationFrame(render)
    }

    // 启动渲染循环
    requestAnimationFrame(render)
  </script>
</body>
```

你可以添加一个播放控制按钮用于随时暂停查看效果：

`index.html`

```html
<!-- 播放控制按钮 -->
<div class="controls">
  <button id="play-btn">播放 / 暂停</button>
</div>

<script>
  // 按钮点击事件
  const playBtn = document.getElementById('play-btn')
  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video
        .play()
        .then(() => {
          console.log('视频开始播放')
        })
        .catch((err) => {
          console.error('视频播放失败，原因:', err)
        })
    } else {
      video.pause()
      console.log('视频已暂停')
    }
  })
</script>
```

注入css，其中canvas的style必须设置为背景透明。给展示的div设置一个棋盘格背景便于查看透明效果：

`style.css`

```css
body {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: sans-serif;
  color: #fff;
}

/* 棋盘格背景容器 */
.preview-box {
  width: 360px;
  height: 360px;
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
}

/* Canvas 必须背景透明 */
canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.controls {
  margin-top: 15px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
}
```

这里给视频文件设置了跨域限制`video.crossOrigin = 'anonymous'`，如果你使用vscode进行调试，使用Live Server即可直接调试查看。或者可以在本地启动静态服务器：

```bash
# 进入项目目录并启动端口自定义的服务
cd /Users/xxx（你的项目文件夹）
python3 -m http.server 8000
```

在浏览器地址栏输入： `http://localhost:8000/index.html`

### 最终效果

可以看到左右双通道融合后的效果透明视频播放效果，且半透明边缘部分也完美显示。

<video src="/posts/transp_mix.mp4" autoplay loop muted playsinline width="60%"></video>
