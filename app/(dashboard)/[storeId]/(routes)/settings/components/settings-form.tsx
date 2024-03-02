"use client";

import { Store } from "@prisma/client";

type Props = {
  initialData: Store;
};

export const SettingsForm = ({ initialData }: Props) => {
  //code
  return (
    <div className="flex items-center justify-between">
      <Heading title="Settings" description="Manage store preferences" />
    </div>
  );
};
