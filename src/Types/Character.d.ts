type CharacterRequest = {
  status: "pending" | "completed" | "processing" | "failed";
  message: string;
  id: string;
};

type CharacterResponse = {
  status: "pending" | "completed" | "processing" | "failed";
  response?: string;
};

export { CharacterRequest, CharacterResponse };
