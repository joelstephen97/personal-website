import { useMouseInElement } from "@vueuse/core";
import { computed, ref, type Ref } from "vue";

export function useCardTilt(options?: { maxTilt?: number }) {
  const maxTilt = options?.maxTilt ?? 5;
  const cardRef = ref<HTMLElement | null>(null);
  const isHovering = ref(false);

  const { elementX, elementY, elementWidth, elementHeight, isOutside } =
    useMouseInElement(cardRef as Ref<HTMLElement>);

  const tiltStyle = computed(() => {
    if (isOutside.value || !isHovering.value) {
      return {
        transform: "perspective(800px) rotateX(0deg) rotateY(0deg)",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      };
    }

    const xPercent = elementWidth.value
      ? elementX.value / elementWidth.value
      : 0.5;
    const yPercent = elementHeight.value
      ? elementY.value / elementHeight.value
      : 0.5;

    const rotateY = (xPercent - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - yPercent) * maxTilt * 2;

    return {
      transform: `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
      transition: "transform 0.1s ease-out",
      "--mouse-x": `${(xPercent * 100).toFixed(1)}%`,
      "--mouse-y": `${(yPercent * 100).toFixed(1)}%`,
    };
  });

  function onMouseEnter() {
    isHovering.value = true;
  }

  function onMouseLeave() {
    isHovering.value = false;
  }

  return { cardRef, tiltStyle, onMouseEnter, onMouseLeave };
}
