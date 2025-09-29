import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card.tsx";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { Button } from "../../../ui/button.tsx";
import { Trash2 } from "lucide-react";

type Building = {
  id: string;
  buildingName: string;
  address: string;
  floors: string;
  description: string;
};


type Props = {
  building: Building;
  colorClass: string;
  onEdit: (building: Building) => void;
  onDelete: (building: Building) => void;
};

export function BuildingCard({ building, colorClass, onEdit, onDelete }: Props) {
  return (
    <Card
      className={`shadow-sm cursor-pointer hover:shadow-md ${colorClass}`}
      onClick={() => onEdit(building)}
    >
      <CardHeader className="flex items-center gap-2">
        <HiOutlineBuildingLibrary className="h-5 w-5" />
        <CardTitle>
          <u>{building.buildingName}</u>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm"><b>Address: </b><i>{building.address}</i></p>
        <p className="text-sm"><b>Floors: </b><i>{building.floors}</i></p>
        <p className="text-sm">{building.description}</p>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(building);
          }}
          className="mt-2 flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
