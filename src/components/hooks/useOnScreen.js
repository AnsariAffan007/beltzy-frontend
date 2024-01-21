import { useEffect, useState } from 'react'

export default function useOnScreen(ref) {

  const [isIntersecting, setIntersecting] = useState(false)

  // const observer = useMemo(() => new IntersectionObserver(
  //   ([entry]) => setIntersecting(entry.isIntersecting)
  // ), [ref])
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref]);

  return isIntersecting
}