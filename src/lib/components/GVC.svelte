<script lang="ts">
  import { onMount } from 'svelte';
  import { VideoController } from '$lib/helpers/VideoController.js';

  export let path: string = "";
  export let width: number | string = 640;
  export let height: number | string = 360;
  
  let videoElement: HTMLVideoElement | null = null;
  let controller: VideoController | null = null;

  export let volume: number = 0;
  export let currentTime: number = 0;
  export let duration: number = 0;
  export let isPlaying: boolean = false;
  export let isMuted: boolean = false;

  const GESTURES = [
    {title: "Double Click/Tap Right", description: "Advances the video by 10 seconds"},
    {title: "Double Click/Tap Left", description: "Rewinds the video by 10 seconds"},
    {title: "Drag Down", description: "Turn down the volume"},
    {title: "Drag Up", description: "Turn Up the volume"},
    {title: "Press/Click And Hold", description: "Pause the video"},
    {title: "Release After Pressing", description: "Resume the video"},
    {title: "Drag To The Right", description: "Advance the video by 10 seconds"},
    {title: "Drag To The Left", description: "Rewind the video by 10 seconds"},
    {title: "Quick Click/Tap", description: "Mutes/unmutes the video"},
  ];

  onMount(() => {
    if (videoElement) {
      controller = new VideoController(videoElement);

      const interval = setInterval(() => {
        if (controller) {
          volume = controller.getVolume();
          currentTime = controller.getCurrentTime();
          duration = controller.getDuration();
          isPlaying = controller.isPlaying();
          isMuted = controller.isMutedStatus();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  });
</script>

<div class="">
  <video 
    bind:this={videoElement}
    width={width} 
    height={height} 
    autoplay loop muted playsinline
    class="rounded-md shadow-3xl"
  >
    <source src={path} type="video/mp4" />
  </video>
</div>

<section class="absolute top-2 right-2 text-gray-600 body-font px-2 py-4 shadow border rounded-md bg-white hidden md:block">
  <h2 class="text-center mb-3"> Video Attributes </h2>
  <table class="table-auto w-full text-left whitespace-no-wrap">
    <tbody>
      <tr>
        <td class="px-2 py-1 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl-md border">Volume</td>
        <td class="px-2 py-1 rounded-tr-md border">{Math.round(volume * 100)}%</td>
      </tr>
      <tr>
        <td class="px-2 py-1 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 border">Current Time</td>
        <td class="px-2 py-1 border">{currentTime.toFixed(2)}s</td>
      </tr>
      <tr>
        <td class="px-2 py-1 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 border">Duration</td>
        <td class="px-2 py-1 border">{duration.toFixed(2)}s</td>
      </tr>
      <tr>
        <td class="px-2 py-1 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 border">Playing</td>
        <td class="px-2 py-1 border">{isPlaying ? 'YES' : 'NO'}</td>
      </tr>
      <tr>
        <td class="px-2 py-1 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 border rounded-bl-md">Mutated</td>
        <td class="px-2 py-1 border rounded-br-md">{isMuted ? 'YES' : 'NO'}</td>
      </tr>
    </tbody>
  </table>
</section>

<section class="absolute top-2 left-2 text-gray-600 body-font px-2 py-4 shadow border rounded-md bg-white hidden md:block">
  <h2 class="text-center mb-3"> Gestures </h2>
  <table class="table-auto w-full text-left whitespace-no-wrap">
    <tbody>
      {#each GESTURES as gesture}
        <tr>
          <td class="px-2 py-1 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl-md border">{gesture.title}</td>
          <td class="px-2 py-1 border rounded-tr-md">{gesture.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>