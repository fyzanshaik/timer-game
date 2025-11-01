export interface ScoreData {
  id: number;
  userId: number;
  timer1Score: number;
  timer5Score: number;
  timer10Score: number;
  timer15Score: number;
  timer30Score: number;
}

export interface UserData {
  id: number;
  username: string;
  scores: ScoreData[];
}

export interface UserCheckRequest {
  userName: string;
}

export interface UserCheckResponse {
  message?: string;
  id: number;
  username: string;
  scores: ScoreData[];
}

export interface UpdateScoreRequest {
  userId: number;
  userName: string;
  timerName: "timer1Score" | "timer5Score" | "timer10Score" | "timer15Score" | "timer30Score";
  newScore: number;
}

export interface UpdateScoreResponse {
  message: string;
  updatedScore?: ScoreData;
}

export interface LeaderboardEntry {
  user: {
    username: string;
  };
  timer1Score?: number;
  timer5Score?: number;
  timer10Score?: number;
  timer15Score?: number;
  timer30Score?: number;
}

export type TimerKey = "timer1" | "timer5" | "timer10" | "timer15" | "timer30";
export type TimerScoreKey = `${TimerKey}Score`;
