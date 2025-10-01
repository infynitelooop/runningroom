// types/enums.ts
export type EnumItem = {
  key: string;
  label: string;
};

export type Enums = {
  roomTypes: EnumItem[];
  crewTypes: EnumItem[];
  roomCategory: EnumItem[];
  attachmentType: EnumItem[];
  roomStatus: EnumItem[];
  occupancyStatus: EnumItem[];
};
