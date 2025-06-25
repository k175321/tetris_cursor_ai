"use client";
import dynamic from 'next/dynamic';

const TetrisGame = dynamic(() => import('../components/TetrisGame'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
});

export default function Home() {
  return <TetrisGame />;
}
