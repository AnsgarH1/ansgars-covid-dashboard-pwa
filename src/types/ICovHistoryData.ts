export interface ICovHistorie {
  weekIncidence: Number;
  date: Date;
}

export interface ICovHistoryData {
  ags: String;
  history: Array<ICovHistorie>;
  name: String;
}
