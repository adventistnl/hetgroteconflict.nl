import { MutableRefObject } from "react";
import { create } from "zustand";

export interface RefState {
  ref_AboutSection: MutableRefObject<HTMLDivElement | null> | null;
  ref_DownloadSection: MutableRefObject<HTMLDivElement | null> | null;
  ref_ReceiveAtHomeSection: MutableRefObject<HTMLDivElement | null> | null;
  ref_TalkToUsSection: MutableRefObject<HTMLDivElement | null> | null;

  setRef_AboutSection: (
    ref: MutableRefObject<HTMLDivElement | null> | null,
  ) => void;
  setRef_DownloadSection: (
    ref: MutableRefObject<HTMLDivElement | null> | null,
  ) => void;
  setRef_ReceiveAtHomeSection: (
    ref: MutableRefObject<HTMLDivElement | null> | null,
  ) => void;
  setRef_TalkToUsSection: (
    ref: MutableRefObject<HTMLDivElement | null> | null,
  ) => void;
}

const initialState = {
  ref_AboutSection: null,
  ref_DownloadSection: null,
  ref_ReceiveAtHomeSection: null,
  ref_TalkToUsSection: null,
};

export const useRefStore = create<RefState>()((set) => ({
  ...initialState,
  setRef_AboutSection: (ref: MutableRefObject<HTMLDivElement | null> | null) =>
    set(() => ({ ref_AboutSection: ref })),
  setRef_DownloadSection: (
    ref: MutableRefObject<HTMLDivElement | null> | null,
  ) => set(() => ({ ref_DownloadSection: ref })),
  setRef_ReceiveAtHomeSection: (
    ref: MutableRefObject<HTMLDivElement | null> | null,
  ) => set(() => ({ ref_ReceiveAtHomeSection: ref })),
  setRef_TalkToUsSection: (
    ref: MutableRefObject<HTMLDivElement | null> | null,
  ) => set(() => ({ ref_TalkToUsSection: ref })),
}));
