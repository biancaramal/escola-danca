export interface Modalidade {
  id: number,
  name: string;
  dates: string;
  hour: string;
  price: string;
}

export interface User {
  id: number,
  name: string,
  email: string,
  created_at: string
}

export interface Admin {
    id: number,
    name: string,
    email: string,
    created_at: string,
}

export interface Contato {
	id: number,
	name: string,
	type: string,
	value: string,
}

export interface Imagem {
	id: number,
	name: string,
	path: string,
}

export interface Boleto {
  reference: string,
  cod: string,
  modalidade: number,
  user: number,
  status: string,
}

export interface Video {
  id: number,
  name: string,
  url: string
}
