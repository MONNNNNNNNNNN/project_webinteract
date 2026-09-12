import { isVideoUrl } from "../lib/media.js";

/**
 * An `image_url` rendered as whatever it actually is.
 *
 * Every public page used to render it with <img>, so a video the admin form
 * happily accepted showed up as a broken image. Without `controls` a video
 * plays like card art (muted, looping); with them it is the full player, for
 * the modals.
 */
export default function MediaView({ src, alt, className, controls = false }) {
  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        aria-label={alt}
        className={className}
        muted
        playsInline
        loop
        autoPlay={!controls}
        controls={controls}
      />
    );
  }
  return <img src={src} alt={alt} draggable={false} className={className} />;
}
