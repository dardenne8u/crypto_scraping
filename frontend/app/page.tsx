"use client";
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import { fetchCryptoData } from '@/lib/crypto-api'
import { io, Socket } from 'socket.io-client'
import { SetStateAction, useEffect, useState } from 'react'
import { CryptoData } from '@/types/crypto'
import { SearchBar } from "@/components/ui/search";

export default function Page() {
  const [messages, setMessages] = useState<CryptoData[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleSelectName = (name: string) => {
    console.log("Select Name:", name);
    setSelectedName(name);
  };

  const filteredData = messages.filter((item) => {
    if (!search) return true;
    return item.name?.toLowerCase().includes(search.toLowerCase());
  });

  // sinon le DataTable est vide au depart
  function getAllLastData() {
    try {
      fetch("http://localhost:9000/lastdata")
        .then((response) => response.json())
        .then((data) => {
          console.log("Données récupérées:", data);
          setMessages(data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données:", error);
        });
    }
    catch (error) {
      console.error("Erreur inattendue:", error);
    }
  }

  useEffect(() => {
    getAllLastData();
    const socket = new WebSocket('ws://localhost:9000/connect');
    const socketInitializer = async () => {
      
      
      socket.onopen = () => {
        console.log('connected')
        socket.send("Hello Server");
      }

      socket.onmessage = (event) => {
        try {
          const rawMessage = JSON.parse(event.data);
          const newData: CryptoData = rawMessage.payload || rawMessage;

          console.log("📦 Donnée extraite:", newData);

          if (!newData || !newData.name || typeof newData.price !== 'number') {
              console.warn("Donnée ignorée (payload invalide ou vide)", newData);
              return; 
          }

          setMessages((prevMessages) => {
            const index = prevMessages.findIndex((m) => m.name === newData.name);
            console.log("Index trouvé:", index);

            if (index !== -1) {
              // Mise à jour
              const updatedMessages = [...prevMessages];
              updatedMessages[index] = newData; 
              console.log("Mise à jour de la donnée:", newData);
              return updatedMessages;
            } else {
              // Ajout
              console.log("Ajout de la donnée:", newData);
              return [...prevMessages, newData];
            }
          });

        } catch (err) {
          console.error("Error parsing message:", err);
        }
      };

      socket.onclose = () => {
        console.log('disconnected');
      }
    }
    socketInitializer()

    return () => {
      if (socket) {
        console.log("Cleaning up socket...");
        socket.close();
      }
    };
  }, []) 

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <div className="flex flex-1 flex-col gap-2 @container/main">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive selectedName={selectedName} />
          </div>

          {/* Search Bar */}
          <div className="px-4 lg:px-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Filter Table */}
          <div className="px-4 lg:px-6">
             <DataTable data={filteredData} onSelectName={handleSelectName} />
          </div>
          
        </div>
      </div>
    </div>
  );
}