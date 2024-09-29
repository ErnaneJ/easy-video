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

  constructor(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
    this.initEventListeners();
  }

  private initEventListeners() {
    this.videoElement.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    this.videoElement.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.videoElement.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.videoElement.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.videoElement.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    this.videoElement.addEventListener("touchstart", this.handleTouchStart.bind(this));
    this.videoElement.addEventListener("touchmove", this.handleTouchMove.bind(this));
    this.videoElement.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  private handleDoubleClick(event: MouseEvent) {
    const rect = this.videoElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    if (clickX > rect.width / 2) {
      this.videoElement.currentTime = Math.min(this.videoElement.duration, this.videoElement.currentTime + 10);
    } else {
      this.videoElement.currentTime = Math.max(0, this.videoElement.currentTime - 10);
    }
  }

  private handleMouseDown(event: MouseEvent) {
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
    this.isDragging = true;

    if (event.button === 0) {
      this.isPausedByHold = true;
      this.videoElement.pause();
    }

    this.startClick = new Date().getTime();
  }

  private handleMouseMove(event: MouseEvent) {
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
  }

  private handleMouseLeave() {
    this.isDragging = false;
    if (this.isPausedByHold) {
      this.isPausedByHold = false;
      this.videoElement.play();
    }
  }

  private handleMouseUp() {
    this.isDragging = false;
    if (this.isPausedByHold) {
      this.isPausedByHold = false;
      this.videoElement.play();
    }

    if(this.startClick && new Date().getTime() - this.startClick < 200) {
      if(this.volumeChanged || this.progressChanged) {
        this.volumeChanged = false;
        this.progressChanged = false;
        return;
      }
      this.isMuted = !this.isMuted;
      this.videoElement.muted = this.isMuted;
    }
  }

  private handleTouchStart(event: TouchEvent) {
    this.lastTouchX = event.touches[0].clientX;
    this.lastTouchY = event.touches[0].clientY;
  }

  private handleTouchMove(event: TouchEvent) {
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
  }

  private handleTouchEnd() {
    this.lastTouchX = 0;
    this.lastTouchY = 0;
  }

  private increaseVolume() {
    this.videoElement.volume = Math.min(1, this.videoElement.volume + 0.05);
  }

  private decreaseVolume() {
    this.videoElement.volume = Math.max(0, this.videoElement.volume - 0.05);
  }

  public getVolume(): number {
    return this.videoElement.volume;
  }

  public getCurrentTime(): number {
    return this.videoElement.currentTime;
  }

  public getDuration(): number {
    return this.videoElement.duration;
  }

  public isPlaying(): boolean {
    return !this.videoElement.paused;
  }

  public isMutedStatus(): boolean {
    return this.isMuted;
  }
}
