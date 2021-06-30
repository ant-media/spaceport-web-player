<h1 align="center">
  <a href="https://github.com/dec0dOS/amazing-github-template">
    <img src="https://user-images.githubusercontent.com/54481799/95862105-16cb0e00-0d6b-11eb-9087-88888889825d.png" alt="Antmedia" >
  </a>
</h1>

<div align="center">
  Spaceport Volumetric Video Capture & Streaming
  <br />
  <br />
  <a href="https://github.com/ant-media/spaceport-web-player/issues">Report a Bug</a>
  ·
  <a href="https://github.com/ant-media/spaceport-web-player/issues">Request a Feature</a>
  .
  <a href="https://github.com/dec0dOS/amazing-github-template/discussions">Ask a Question</a>
</div>

<div align="center">
<br />


[![Chrome Support]( https://img.shields.io/badge/Spaceport-%201.2-critical)](https://github.com/ant-media/Ant-Media-Server/wiki/Meet-Spaceport)
[![Chrome Support]( https://img.shields.io/badge/Browser%20Compatibility-Chrome-green)](https://github.com/ant-media/spaceport-web-player/issues)
[![Edge Support]( https://img.shields.io/badge/Browser%20Compatibility-Edge-blue)](https://github.com/ant-media/spaceport-web-player/issues)
[![PRs welcome](https://img.shields.io/badge/PRs-%20Welcome-important)](https://github.com/ant-media/spaceport-web-player/issues)
  
 

</div>

<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
- [Spaceport Web Player](#spaceport-web-player)
- [Roadmap](#roadmap)
- [Articles](#articles)
- [Contributing](#contributing)

</details>



## About

<table>
<tr>
<td>

Volumetric video is a field of media production technique that captures a three-dimensional space such as a place, person, or any object. Spaceport developed by Ant Media creates an end-to-end solution to capture dynamic scenes and offers a truly three-dimensional viewing experience with 6 Degrees of Freedom. It supports video playback on VR goggles, web browsers, and mobile devices.

Compared to other existing capture systems, Spaceport is suitable for high-quality, low-cost volumetric capture solutions. The default setup is occurring 6 Azure Kinect cameras covering a reconstruction volume of 1m in diameter and 2m high. Each of them equipped with a high-quality 1M pixel TOF Image Sensor so Spaceport can record 1024*1024 depth images and 1920×1080 RGB images at 15 frames per second.



The key features of **Spaceport**:

-  Suitable for high-quality, low-cost volumetric capture
-  Support multi view volumetric video capturing
-  Suitalbe with Jetson Nano
-  Suitable for record audio

<details open>
<summary>Additional info</summary>
<br>

Six cameras are distributed in different locations in respect to the scene to create 360-degree point clouds even in various lighting conditions. The ideal distance from six cameras to the center of the recording volume is about 1 to 3 m. The person stands in the middle of the 1 square meter capturing area. The angle between each camera is about 60 degrees, and all cameras point toward the center of the recording volume.
  
Spaceport creates a high-quality point cloud for each frame and for streamable, free-viewpoint video, the point clouds from all cameras must be registered perfectly. Spaceport uses advanced Robot Operating System (ROS) algorithms, Point Cloud Library (PCL) and calibration object to estimate the exact transformation matrix. The calibration object is a pattern attached checker board. The person holds the object in his/her hand and all cameras are aligned with reference camera.

</details>

</td>
</tr>
</table>

## Spaceport Web Player

Volumetric Video Industry is growing and 6Dof videos are being great tools for catching attention and storytelling. Companies allocate more budgets for this new video era. However, there are no standards for volumetric video players yet. Each company creates its own specific players and these players offer only limited options for device support. When you want to watch a volumetric video on any platform or anywhere these options might be a barrier. Besides all these, using VR glasses can be a problem for your budget, or you may have various health problems (headache, nausea). And now, notwithstanding the quality of VR gogglers, we have one more option to watch volumetric videos: Spaceport Volumetric Video Web Player.

Spaceport offers an opportunity to watch volumetric videos on web players without VR devices. You can set your view with mouse/touch events and continue to watch the videos
You can access [Spaceport Volumetric Web Player from here](https://ant-media.github.io/spaceport-web-player/spaceport_web_player.html).


https://user-images.githubusercontent.com/20575896/124042521-ab68bf80-da11-11eb-81b9-7e049c494ec7.mp4



## Roadmap

## Articles

To get more detailed information about Volumetric Capture & Playback check the following articles.

[Spaceport 1.2: Capturing Volumetric Video With Jetson Nano](https://antmedia.io/spaceport-volumetric-video/)

[Spaceport 1.0 : How To Capture Volumetric Video?](https://antmedia.io/spaceport-1-0-how-to-capture-volumetric-video/)

[Spaceport Volumetric Video Web Player](https://antmedia.io/spaceport-volumetric-video-web-player/)

[How To Play Spaceport Volumetric Live Video In Unity](https://antmedia.io/spaceport-volumetric-live-video-in-unity/)

[How To Import Volumetric Video Container Into Unity](https://antmedia.io/volumetric-video-container-2/ "How To Import Volumetric Video Container Into Unity")

[Spaceport: Volumetric Video Capturing and Streaming Solution](https://antmedia.io/volumetric-video/ "Spaceport: Volumetric Video Capturing and Streaming Solution")

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
