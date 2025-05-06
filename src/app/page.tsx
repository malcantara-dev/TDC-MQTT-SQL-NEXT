'use client';
import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

type DataItem = {
  id: number;
  timestamp: string;
  device_id: string;
  value: number;
};

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const items = (await res.json()) as DataItem[];
        setData(items);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchData();

    // Configurar MQTT para atualização em tempo real
    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER!;
    const topic = process.env.NEXT_PUBLIC_MQTT_TOPIC!;

    const client = mqtt.connect(brokerUrl, {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      console.log('MQTT conectado para atualizações');
      client.subscribe(topic, (err) => {
        if (err) console.error('Erro ao inscrever no tópico MQTT:', err);
      });
    });

    client.on('message', (t, message) => {
      if (t === topic) {
        console.log('Nova mensagem MQTT recebida, atualizando dados...');
        fetchData();
      }
    });

    client.on('error', (mqttError) => {
      console.error('Erro MQTT:', mqttError);
    });

    return () => {
      client.end();
    };
  }, []);

  if (error) {
    return <main className="p-6 text-red-600">Erro: {error}</main>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Feita com TDC + MQTT + PostgresSQL + NextJS</h1>
      <table className="w-full border text-left">
        <thead>
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Timestamp</th>
            <th className="p-2 border">Dispositivo</th>
            <th className="p-2 border">Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td className="p-2 border">{d.id}</td>
              <td className="p-2 border">{new Date(d.timestamp).toLocaleString()}</td>
              <td className="p-2 border">{d.device_id}</td>
              <td className="p-2 border">{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}