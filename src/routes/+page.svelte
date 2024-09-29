<script>
  import GVC from "$lib/components/GVC.svelte";
  import video from "$lib/assets/videos/video.mp4";
</script>

<svelte:head>
  <title>Svelte - Gesture Video Controller</title>
</svelte:head>

<section class="w-full h-full min-h-screen flex items-center justify-center">
  <GVC path="{video}" width="380" height="620" />
</section>