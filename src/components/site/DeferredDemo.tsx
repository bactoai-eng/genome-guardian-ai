import { lazy, Suspense, useEffect, useRef, useState } from "react";

const ProductDemo = lazy(() =>
  import("./ProductDemo").then((module) => ({ default: module.ProductDemo })),
);

function DemoAnchor() {
  useEffect(() => {
    if (window.location.hash !== "#demo") return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("demo")?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}

/** Keep the analyzer and its dependencies out of the first-screen request path. */
export function DeferredDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(element);
    const onHash = () => {
      if (window.location.hash === "#demo") setReady(true);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  const placeholder = (
    <div id="demo" className="demo-placeholder scroll-mt-24" aria-busy="true">
      <p className="text-sm text-muted-foreground" role="status">
        Loading demonstration…
      </p>
    </div>
  );

  return (
    <div ref={ref} className="deferred-demo">
      {ready ? (
        <Suspense fallback={placeholder}>
          <ProductDemo />
          <DemoAnchor />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}
