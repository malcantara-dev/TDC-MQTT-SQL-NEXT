import mqtt from 'mqtt';
import { saveTdcData } from './db';

export function connectMqtt() {
  // Definindo as opções de conexão
  const mqttOptions = {
    username: process.env.MQTT_USERNAME, // Variáveis de ambiente para usuário
    password: process.env.MQTT_PASSWORD, // Variáveis de ambiente para senha
    clean: true,
    reconnectPeriod: 1000, // Tempo de reconexão
    keepalive: 60, // Intervalo para mensagens keepalive
  };

  // Conectando ao broker MQTT com as credenciais e opções
  const client = mqtt.connect(process.env.MQTT_BROKER as string, mqttOptions);

  // Evento de sucesso na conexão
  client.on('connect', () => {
    console.log('Conexão com o broker MQTT estabelecida com sucesso!');
    client.subscribe(process.env.MQTT_TOPIC as string, (err) => {
      if (err) {
        console.error('Erro ao se inscrever no tópico:', err);
      } else {
        console.log(`Inscrição no tópico ${process.env.MQTT_TOPIC} bem-sucedida`);
      }
    });
  });

  // Evento de erro na conexão
  client.on('error', (err) => {
    console.error('Erro de conexão MQTT:', err);
  });

  // Evento de recebimento de mensagem
  client.on('message', async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      await saveTdcData(data.device_id, data.value);
    } catch (err) {
      console.error('Erro ao salvar dados do MQTT:', err);
    }
  });
}
