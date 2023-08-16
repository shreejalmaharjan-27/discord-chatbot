import { CharacterRequest, CharacterResponse } from "../Types";

interface IMyHeaders {
  [key: string]: string;
}
class Rafled {
  static async character(
    character: string,
    message: string,
    room: string,
    context?: string,
    user?: string
  ): Promise<CharacterRequest> {
    const response = await this.request(
      `https://app.rafled.jp/api/character/${character}/chat?message=${message}&room=${room}&context=${context}&user=${user}`
    );
    const json = await response.json();
    return json;
  }

  static async status(id: string): Promise<CharacterResponse> {
    const response = await this.request(
      `https://app.rafled.jp/api/queues/character/${id}/status`
    );
    const json = await response.json();
    return json;
  }

  // returns fetch response
  static async request(
    endpoint: string,
    data?: object,
    method: string = "GET",
    headers: IMyHeaders = {}
  ): Promise<Response> {
    headers["accept"] = "application/json";
    headers["x-api-key"] = process.env.RAFLED_API_KEY || "";
    const response = await fetch(endpoint, {
      method: method,
      headers: headers,
      body: method !== "GET" ? JSON.stringify(data) : null,
    });

    return response;
  }
}

export default Rafled;
