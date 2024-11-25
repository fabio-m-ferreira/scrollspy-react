"use client";
import React, {
  useEffect,
  useState,
  useRef,
  ReactNode,
  ElementType,
} from "react";

type ScrollspyProps = {
  items: string[];
  currentClassName: string;
  scrolledPastClassName?: string;
  style?: React.CSSProperties;
  componentTag?: ElementType;
  offset?: number;
  rootEl?: string;
  onUpdate?: (item?: HTMLElement) => void;
  children: ReactNode;
};

const throttle = (fn: () => void, threshold = 100) => {
  let last: number | undefined;
  let timer: NodeJS.Timeout | undefined;

  return () => {
    const now = Date.now();
    const timePassed = last !== undefined && now < last + threshold;

    if (timePassed) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn();
      }, threshold);
    } else {
      last = now;
      fn();
    }
  };
};

const Scrollspy: React.FC<ScrollspyProps> = ({
  items,
  currentClassName,
  scrolledPastClassName,
  style,
  componentTag: ComponentTag = "ul",
  offset = 0,
  rootEl,
  onUpdate = () => {},
  children,
}) => {
  const [targetItems, setTargetItems] = useState<HTMLElement[]>([]);
  const [inViewState, setInViewState] = useState<boolean[]>([]);
  const [isScrolledPast, setIsScrolledPast] = useState<boolean[]>([]);
  const scrollHandler = useRef(() => {});

  const initSpyTarget = () => {
    const targets = items
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    setTargetItems(targets);
    return targets;
  };

  const getScrollDimension = () => {
    const el = rootEl
      ? document.querySelector(rootEl)
      : document.documentElement;
    const scrollTop = el?.scrollTop || 0;
    const scrollHeight = el?.scrollHeight || 0;
    return { scrollTop, scrollHeight };
  };

  const isInView = (el: HTMLElement | null) => {
    if (!el) return false;

    const rootRect = rootEl
      ? document.querySelector(rootEl)?.getBoundingClientRect()
      : undefined;
    const rect = el.getBoundingClientRect();
    const winH = rootEl ? rootRect?.height || 0 : window.innerHeight;
    const { scrollTop } = getScrollDimension();

    const elTop = rootEl
      ? rect.top + scrollTop - (rootRect?.top || 0) + offset
      : rect.top + scrollTop + offset;
    const elBottom = elTop + el.offsetHeight;

    return elTop < scrollTop + winH && elBottom > scrollTop;
  };

  const getElemsViewState = () => {
    const elemsInView: HTMLElement[] = [];
    const elemsOutView: HTMLElement[] = [];
    const viewStatusList: boolean[] = [];
    let hasInView = false;

    targetItems.forEach((item) => {
      const isCurrentlyInView = hasInView ? false : isInView(item);
      hasInView = hasInView || isCurrentlyInView;
      viewStatusList.push(isCurrentlyInView);

      if (isCurrentlyInView) {
        elemsInView.push(item);
      } else {
        elemsOutView.push(item);
      }
    });

    return {
      inView: elemsInView,
      outView: elemsOutView,
      viewStatusList,
      scrolledPast: scrolledPastClassName
        ? viewStatusList.map(
            (inView, i) => !inView && i < viewStatusList.indexOf(true)
          )
        : [],
    };
  };

  const spy = () => {
    const { viewStatusList, scrolledPast } = getElemsViewState();
    if (JSON.stringify(viewStatusList) !== JSON.stringify(inViewState)) {
      setInViewState(viewStatusList);
      setIsScrolledPast(scrolledPast);
      const activeItem = targetItems[viewStatusList.indexOf(true)];
      onUpdate(activeItem);
    }
  };

  const handleSpy = throttle(() => spy(), 100);

  useEffect(() => {
    setTargetItems(initSpyTarget());
    scrollHandler.current = handleSpy;

    const scrollEl = rootEl ? document.querySelector(rootEl) : window;
    scrollEl?.addEventListener("scroll", scrollHandler.current);

    return () => {
      scrollEl?.removeEventListener("scroll", scrollHandler.current);
    };
  }, [items, rootEl]);

  return (
    <ComponentTag style={style}>
      {React.Children.map(children, (child, idx) => {
        if (React.isValidElement<{ className?: string }>(child)) {
          const childClassName = [
            child.props.className,
            inViewState[idx] && currentClassName,
            isScrolledPast[idx] && scrolledPastClassName,
          ]
            .filter(Boolean)
            .join(" ");

          return React.cloneElement(child, { className: childClassName });
        }

        return child;
      })}
    </ComponentTag>
  );
};

export default Scrollspy;
