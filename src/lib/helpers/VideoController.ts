/**
 * VideoController handles video playback and user interactions with a video element.
 */
export class VideoController {
  private videoElement: HTMLVideoElement;
  private isPausedByHold: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private lastTouchX: number = 0;
  private lastTouchY: number = 0;
  private volumeChangeThreshold: number = 5;
  private isMuted: boolean = true;
  private isDragging: boolean = false;
  private volumeChanged: boolean = false;
  private progressChanged: boolean = false;
  private startClick: number = 0;

  /**
   * Creates an instance of VideoController.
   * @param videoElement - The HTML video element to be controlled.
   */
  constructor(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
    this.initEventListeners();
  };

  /**
   * Initializes event listeners for the video element.
   */
  private initEventListeners(): void {
    this.videoElement.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    this.videoElement.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.videoElement.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.videoElement.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.videoElement.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    this.videoElement.addEventListener("touchstart", this.handleTouchStart.bind(this));
    this.videoElement.addEventListener("touchmove", this.handleTouchMove.bind(this));
    this.videoElement.addEventListener("touchend", this.handleTouchEnd.bind(this));
  };

  /**
   * Handles double-click events to seek forward or backward in the video.
   * @param event - The mouse event.
   */
  private handleDoubleClick(event: MouseEvent): void {
    const rect = this.videoElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    if (clickX > rect.width / 2) {
      this.videoElement.currentTime = Math.min(this.videoElement.duration, this.videoElement.currentTime + 10);
    } else {
      this.videoElement.currentTime = Math.max(0, this.videoElement.currentTime - 10);
    }
  };

  /**
   * Handles mouse down events to initiate dragging and pause the video if necessary.
   * @param event - The mouse event.
   */
  private handleMouseDown(event: MouseEvent): void {
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
    this.isDragging = true;

    if (event.button === 0) { // Left mouse button
      this.isPausedByHold = true;
      this.videoElement.pause();
    }

    this.startClick = new Date().getTime();
  };

  /**
   * Handles mouse move events to adjust volume or seek through the video.
   * @param event - The mouse event.
   */
  private handleMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const deltaX = event.clientX - this.lastMouseX;
      const deltaY = event.clientY - this.lastMouseY;
      
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;

      if (Math.abs(deltaY) > this.volumeChangeThreshold) {
        this.volumeChanged = true;
        if (deltaY > 0) {
          this.decreaseVolume();
        } else {
          this.isMuted = false;
          this.videoElement.muted = false;
          this.increaseVolume();
        }
        return;
      }

      if (Math.abs(deltaX) > 1) {
        this.progressChanged = true;
        const percentChange = deltaX / this.videoElement.clientWidth;
        this.videoElement.currentTime += percentChange * this.videoElement.duration;
      }
    }
  };

  /**
   * Handles mouse leave events to reset dragging state and resume playback if paused.
   */
  private handleMouseLeave(): void {
    this.isDragging = false;
    if (this.isPausedByHold) {
      this.isPausedByHold = false;
      this.videoElement.play();
    }
  };

  /**
   * Handles mouse up events to toggle mute or resume playback if needed.
   */
  private handleMouseUp(): void {
    this.isDragging = false;
    if (this.isPausedByHold) {
      this.isPausedByHold = false;
      this.videoElement.play();
    }

    if (this.startClick && new Date().getTime() - this.startClick < 200) {
      if (this.volumeChanged || this.progressChanged) {
        this.volumeChanged = false;
        this.progressChanged = false;
        return;
      }
      this.isMuted = !this.isMuted;
      this.videoElement.muted = this.isMuted;
    }
  };

  /**
   * Handles touch start events to record initial touch position.
   * @param event - The touch event.
   */
  private handleTouchStart(event: TouchEvent): void {
    this.lastTouchX = event.touches[0].clientX;
    this.lastTouchY = event.touches[0].clientY;
  };

  /**
   * Handles touch move events to adjust volume or seek through the video.
   * @param event - The touch event.
   */
  private handleTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    const deltaX = touch.clientX - this.lastTouchX;
    const deltaY = touch.clientY - this.lastTouchY;
    
    this.lastTouchX = touch.clientX;
    this.lastTouchY = touch.clientY;

    if (Math.abs(deltaY) > this.volumeChangeThreshold) {
      this.volumeChanged = true;
      if (deltaY > 0) {
        this.decreaseVolume();
      } else {
        this.isMuted = false;
        this.videoElement.muted = false;
        this.increaseVolume();
      }
      return;
    }

    if (Math.abs(deltaX) > 1) {
      this.progressChanged = true;
      const percentChange = deltaX / this.videoElement.clientWidth;
      this.videoElement.currentTime += percentChange * this.videoElement.duration;
    }
  };

  /**
   * Handles touch end events to reset touch position.
   */
  private handleTouchEnd(): void {
    this.lastTouchX = 0;
    this.lastTouchY = 0;
  };

  /**
   * Increases the volume of the video element by a fixed amount.
   */
  private increaseVolume(): void {
    this.videoElement.volume = Math.min(1, this.videoElement.volume + 0.05);
  };

  /**
   * Decreases the volume of the video element by a fixed amount.
   */
  private decreaseVolume(): void {
    this.videoElement.volume = Math.max(0, this.videoElement.volume - 0.05);
  };

  /**
   * Gets the current volume level of the video element.
   * @returns The current volume level (0 to 1).
   */
  public getVolume(): number {
    return this.videoElement.volume;
  }

  /**
   * Gets the current playback time of the video.
   * @returns The current playback time in seconds.
   */
  public getCurrentTime(): number {
    return this.videoElement.currentTime;
  };

  /**
   * Gets the total duration of the video.
   * @returns The total duration in seconds.
   */
  public getDuration(): number {
    return this.videoElement.duration;
  };

  /**
   * Checks if the video is currently playing.
   * @returns True if the video is playing; otherwise, false.
   */
  public isPlaying(): boolean {
    return !this.videoElement.paused;
  };

  /**
   * Checks if the video is muted.
   * @returns True if the video is muted; otherwise, false.
   */
  public isMutedStatus(): boolean {
    return this.isMuted;
  };
};