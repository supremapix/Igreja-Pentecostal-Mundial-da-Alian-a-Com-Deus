
import React from 'react';
import { Bairro, Cidade, Evento } from './types';

export const CHURCH_NAME = "Igreja Pentecostal Mundial da Aliança Com Deus";
export const LEADER_PRESIDENT = "Apóstolo Juvenal";
export const LEADER_VP = "Bispa Marilene Jayanne";

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
  { id: 1, titulo: "Culto de Celebração", data: "Domingos", horario: "19:00", descricao: "Um momento de louvor, adoração e palavra profética." },
  { id: 2, titulo: "Círculo de Oração", data: "Terças", horario: "15:00", descricao: "Intercessão e busca pela face de Deus." },
  { id: 3, titulo: "Estudo Bíblico", data: "Quintas", horario: "19:30", descricao: "Aprofundamento nas Sagradas Escrituras." },
  { id: 4, titulo: "Vigília Regional", data: "Sexta (Mensal)", horario: "22:00", descricao: "Busca intensa pelo poder do Espírito Santo." },
];

export const NEIGHBORHOODS: Bairro[] = [
  { nome: "Serrote do Urubu", distancia: "Sede", instrucoes: "Localizado próximo à entrada principal da comunidade." },
  { nome: "Tapera", distancia: "5 km", instrucoes: "Seguir pela estrada vicinal leste." },
  { nome: "Roçado", distancia: "8 km", instrucoes: "Acesso via BR-428 sentido Recife." },
  { nome: "Pedra do Bode", distancia: "3 km", instrucoes: "Continuação da via principal do Serrote." },
];

export const CITIES: Cidade[] = [
  { nome: "Petrolina", distancia: "12 km" },
  { nome: "Juazeiro", distancia: "15 km" },
  { nome: "Lagoa Grande", distancia: "50 km" },
  { nome: "Santa Maria da Boa Vista", distancia: "110 km" },
];
