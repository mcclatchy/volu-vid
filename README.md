## aframe-volu-vid-component

Volumetric Video component for [A-Frame](https://aframe.io) , created with DepthKit in Mind.

### Properties

| Property              | Description               | Default Values    |
|-----------------------|---------------------------|-------------------|
| name                  | filename w/o ext          | video             |
| depthFocalLengthX     | Unknown DepthKit Var      | 365.2185974121094 |
| depthFocalLengthY     | Unknown DepthKit Var      | 365.2185974121094 |
| depthImageSizeX       | Full Width of Webm Frame  | 512               |
| depthImageSizeY       | Half Height of Webm Frame | 424               |
| depthPrincipalPointX  | Unknown DepthKit Var      | 257.6430969238281 |
| depthPrincipalPointY  | Unknown DepthKit Var      | 209.3957977294922 |
| farClip               | Unknown DepthKit Var      | 1204.192016601562 |
| nearClip              | Unknown DepthKit Var      | 434.166748046875  |

These should be assigned based on the _meta.txt file created by DepthKit

### Usage

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-randomizer-components@^3.0.1/dist/aframe-randomizer-components.min.js"></script>
</head>

<body>
  <a-scene>
  <a-entity rgbd-video="
         name:video;
         depthFocalLengthX: 365.2185974121094;
         depthFocalLengthY: 365.2185974121094;
         depthImageSizeX: 512;
         depthImageSizeY: 424;
         depthPrincipalPointX: 257.6430969238281;
         depthPrincipalPointY: 209.3957977294922;
         farClip: 1200;
         nearClip: 0;
         " position="0 .3 0" scale="1 1 1" rotation="0 0 -90"> </a-entity>
  </a-scene>
</body>
```
### Video Files
Videos should be exported per-pixel from DepthKit, then converted to .WebM and placed in a directory called 'rgbd_files' 
Follow this great tutorial for details on [exporting from DepthKit](https://vimeo.com/123520067)
