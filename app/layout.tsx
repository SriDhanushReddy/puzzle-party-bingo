import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Puzzle Party · Bingo Battle',description:'Big brains. Little buddies. A multiplayer puzzle party for 2–8 players.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
