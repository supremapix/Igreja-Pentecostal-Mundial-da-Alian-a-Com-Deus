
import React from 'react';
import { Bairro, Cidade, Evento } from './types';

export const CHURCH_NAME = "Igreja Pentecostal Mundial da Aliança Com Deus";
export const LEADER_PRESIDENT = "Apóstolo Juvenal";
export const LEADER_VP = "Bispa Marilene Jayanne";

// Mapeamento das imagens reais com fallbacks temáticos profissionais
export const IMAGES = {
  // Pessoas sentadas na congregação
  CONGREGATION_SITTING: {
    src: "input_file_0.png",
    fallback: "https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=1200&auto=format&fit=crop"
  },
  // Logo da Igreja
  LOGO: {
    src: "input_file_1.png",
    fallback: "https://img.icons8.com/color/512/cross.png" 
  },
  // Homens no altar/púlpito
  PULPIT_MEN: {
    src: "input_file_2.png",
    fallback: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=1200&auto=format&fit=crop"
  },
  // Grupo reunido no púlpito
  PULPIT_GROUP: {
    src: "input_file_3.png",
    fallback: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop"
  },
  // Selfie com a congregação ao fundo
  CONGREGATION_SELFIE: {
    src: "input_file_4.png",
    fallback: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop"
  },
  // Grande auditório/louvor
  CONGREGATION_PRAISING: {
    src: "input_file_5.png",
    fallback: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop"
  },
  // Retratos de Família (Liderança)
  FAMILY_1: {
    src: "input_file_6.png",
    fallback: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop"
  },
  FAMILY_2: {
    src: "input_file_7.png",
    fallback: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=1200&auto=format&fit=crop"
  },
  FAMILY_3: {
    src: "input_file_8.png",
    fallback: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop"
  },
};

export const CONTACTS = {
  whatsapp1: "(87) 99165-5607",
  whatsapp2: "(87) 99188-0456",
  phone: "(87) 92141-4312",
  whatsapp1Raw: "5587991655607",
  whatsapp2Raw: "5587991880456",
};

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  youtube: "https://www.youtube.com/"
};

export const ADDRESS = {
  street: "Rua José Geraldo, 157",
  neighborhood: "Serrote do Urubu",
  zip: "56354-500",
  city: "Petrolina - PE"
};

export const SCHEDULE: Evento[] = [
  { id: 1, titulo: "Culto de Celebração", data: "Domingos", horario: "19:00", descricao: "O grande encontro da família para celebrar a vitória em Cristo." },
  { id: 2, titulo: "Círculo de Oração", data: "Terças", horario: "15:00", descricao: "Intercessão poderosa onde as correntes são quebradas pelo poder da fé." },
  { id: 3, titulo: "Estudo Bíblico", data: "Quintas", horario: "19:30", descricao: "Aprofundamento na sã doutrina para o crescimento espiritual." },
  { id: 4, titulo: "Vigília de Milagres", data: "Sexta (Mensal)", horario: "22:00", descricao: "Uma noite de busca intensa e manifestação da glória de Deus." },
];

export const NEIGHBORHOODS: Bairro[] = [
  { nome: "Serrote do Urubu", distancia: "Sede", instrucoes: "Nossa casa principal! Venha participar da nossa comunidade local e sentir o calor do Espírito Santo." },
  { nome: "Tapera", distancia: "5 km", instrucoes: "Apenas 10 minutos! Siga pela via principal sentido Rio São Francisco. Temos muitos irmãos vindo desta região!" },
  { nome: "Roçado", distancia: "8 km", instrucoes: "Um caminho curto para uma grande bênção. Use a BR-428 para chegar rápido aos nossos cultos." },
  { nome: "Pedra do Bode", distancia: "3 km", instrucoes: "Estamos logo ali! Uma caminhada de fé ou 5 minutos de carro para estar em comunhão." },
  { nome: "Curaçá", distancia: "15 km", instrucoes: "Atravessando a ponte para receber o que Deus tem preparado para você. Vale a pena a viagem!" },
];

export const CITIES: Cidade[] = [
  { nome: "Petrolina", distancia: "Centro a 12 km" },
  { nome: "Juazeiro", distancia: "15 km (Ponte)" },
  { nome: "Lagoa Grande", distancia: "50 km" },
  { nome: "Casa Nova", distancia: "70 km" },
];

export const HERO_PHRASES = [
  "Firmados na Rocha que é Cristo.",
  "Aliança de Vida com o Criador.",
  "Onde o Impossível se torna Real.",
  "Uma Família Pronta para te Receber.",
  "Petrolina Impactada pela Glória de Deus.",
  "Venha Viver o Sobrenatural Conosco."
];

export const MINISTRIES = [
  { title: "Louvor & Adoração", icon: "Music", desc: "Ministrando o coração de Deus através da música e adoração fervorosa." },
  { title: "Geração Aliança", icon: "Users", desc: "Fortalecendo nossa juventude para os desafios do mundo atual." },
  { title: "Crianças de Cristo", icon: "Baby", desc: "Ensinando os pequenos no caminho em que devem andar." },
  { title: "Ação Social", icon: "Heart", desc: "Estendendo a mão ao próximo e refletindo o amor de Jesus na prática." }
];
