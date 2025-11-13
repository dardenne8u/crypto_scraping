"use client"

import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import { fetchCryptoData } from '@/lib/crypto-api'
import { io, Socket } from 'socket.io-client'
import data from './data.json'
import { SetStateAction, useEffect, useState } from 'react'
import { CryptoData } from '@/types/crypto'


export default function Page() {

  const [messages, setMessages] = useState<CryptoData[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null)

  useEffect(() => {
    const socketInitializer = async () => {
      const socket = new WebSocket('ws://localhost:9000/connect');
      socket.onopen = () => {
        console.log('connected')
      }

          socket.onmessage = (event) => {
            try {
              console.log("Received message:", event.data);
              const data: CryptoData = JSON.parse(event.data);
              setMessages([data]);
            } catch (err) {
              console.error("Error parsing message:", err);
            }
          };


      socket.onclose = () => {
        console.log('disconnected')
      }
    }
    socketInitializer()
  }, [])

  const handleSelectName = (name: string) => {
    console.log("Selected name:", name)
    setSelectedName(name)
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex flex-1 flex-col gap-2 @container/main">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* <SectionCards /> */}
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive selectedName={selectedName} />
          </div>
          <DataTable data={data} onSelectName={handleSelectName} />
        </div>
      </div>
    </div>
  )
}
