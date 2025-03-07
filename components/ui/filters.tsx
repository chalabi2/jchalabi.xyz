import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import {
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDotDashed,
  CircleEllipsis,
  CircleX,
  SignalHigh,
  SignalLow,
  SignalMedium,
  UserCircle,
  X,
  FolderKanban,
  Tags,
  Star,
  Layers,
  Server,
  Database,
  Brain,
} from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface AnimateChangeInHeightProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimateChangeInHeight: React.FC<AnimateChangeInHeightProps> = ({
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        // We only have one entry, so we can use entries[0].
        const observedHeight = entries[0].contentRect.height;
        setHeight(observedHeight);
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        // Cleanup the observer when the component is unmounted
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <motion.div
      className={cn(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.1, dampping: 0.2, ease: "easeIn" }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
};

export enum FilterType {
  CATEGORY = "Category",
  FEATURED = "Featured",
  TAGS = "Tags",
}

export enum FilterOperator {
  IS = "is",
  IS_NOT = "is not",
  IS_ANY_OF = "is any of",
  INCLUDE = "include",
  DO_NOT_INCLUDE = "do not include",
  INCLUDE_ALL_OF = "include all of",
  INCLUDE_ANY_OF = "include any of",
  EXCLUDE_ALL_OF = "exclude all of",
  EXCLUDE_IF_ANY_OF = "exclude if any of",
  BEFORE = "before",
  AFTER = "after",
}

export enum Status {
  BACKLOG = "Backlog",
  TODO = "Todo",
  IN_PROGRESS = "In Progress",
  IN_REVIEW = "In Review",
  DONE = "Done",
  CANCELLED = "Cancelled",
}

export enum Assignee {
  ANDREW_LUO = "Andrew Luo",
  NO_ASSIGNEE = "No assignee",
}

export enum Labels {
  BUG = "Bug",
  FEATURE = "Feature",
  HOTFIX = "Hotfix",
  RELEASE = "Release",
}

export enum Priority {
  URGENT = "Urgent",
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

export enum DueDate {
  IN_THE_PAST = "in the past",
  IN_24_HOURS = "24 hours from now",
  IN_3_DAYS = "3 days from now",
  IN_1_WEEK = "1 week from now",
  IN_1_MONTH = "1 month from now",
  IN_3_MONTHS = "3 months from now",
}

export type FilterOption = {
  name: FilterType | Status | Assignee | Labels | Priority | DueDate;
  icon: React.ReactNode | undefined;
  label?: string;
};

export type Filter = {
  id: string;
  type: FilterType;
  operator: FilterOperator;
  value: string[];
};

const FilterIcon = ({
  type,
}: {
  type: FilterType | Status | Assignee | Labels | Priority | string;
}) => {
  switch (type) {
    case Assignee.ANDREW_LUO:
      return (
        <Avatar className="size-3.5 rounded-full text-[9px] text-white">
          <AvatarFallback className="bg-orange-300">AL</AvatarFallback>
        </Avatar>
      );
    case Assignee.NO_ASSIGNEE:
      return <UserCircle className="size-3.5" />;
    case Status.BACKLOG:
      return <CircleDashed className="size-3.5 text-muted-foreground" />;
    case Status.TODO:
      return <Circle className="size-3.5 text-primary" />;
    case Status.IN_PROGRESS:
      return <CircleDotDashed className="size-3.5 text-yellow-400" />;
    case Status.IN_REVIEW:
      return <CircleEllipsis className="size-3.5 text-green-400" />;
    case Status.DONE:
      return <CircleCheck className="size-3.5 text-blue-400" />;
    case Status.CANCELLED:
      return <CircleX className="size-3.5 text-muted-foreground" />;
    case Priority.URGENT:
      return <CircleAlert className="size-3.5" />;
    case Priority.HIGH:
      return <SignalHigh className="size-3.5" />;
    case Priority.MEDIUM:
      return <SignalMedium className="size-3.5" />;
    case Priority.LOW:
      return <SignalLow className="size-3.5" />;
    case Labels.BUG:
      return <div className="bg-red-400 rounded-full size-2.5" />;
    case Labels.FEATURE:
      return <div className="bg-blue-400 rounded-full size-2.5" />;
    case Labels.HOTFIX:
      return <div className="bg-amber-400 rounded-full size-2.5" />;
    case Labels.RELEASE:
      return <div className="bg-green-400 rounded-full size-2.5" />;
    // Custom project filter types
    case FilterType.CATEGORY:
      return <FolderKanban className="size-3.5 text-blue-500" />;
    case FilterType.TAGS:
      return <Tags className="size-3.5 text-purple-500" />;
    case FilterType.FEATURED:
      return <Star className="size-3.5 text-yellow-500" />;
    // Custom category values
    case "frontend":
      return <Layers className="size-3.5 text-indigo-500" />;
    case "backend":
      return <Server className="size-3.5 text-green-600" />;
    case "infrastructure":
      return <Database className="size-3.5 text-amber-600" />;
    case "AI":
      return <Brain className="size-3.5 text-purple-600" />;
    // Common tags
    case "Typescript":
    case "TypeScript":
      return <div className="bg-blue-500 rounded-full size-2.5" />;
    case "JavaScript":
    case "Javascript":
      return <div className="bg-yellow-400 rounded-full size-2.5" />;
    case "Python":
      return <div className="bg-green-500 rounded-full size-2.5" />;
    case "Rust":
      return <div className="bg-orange-600 rounded-full size-2.5" />;
    case "Go":
      return <div className="bg-cyan-500 rounded-full size-2.5" />;
    case "React":
      return <div className="bg-blue-400 rounded-full size-2.5" />;
    case "Next.js":
      return <div className="bg-black rounded-full size-2.5" />;
    case "Blockchain":
      return <div className="bg-purple-400 rounded-full size-2.5" />;
    case "Cosmos":
      return <div className="bg-indigo-500 rounded-full size-2.5" />;
    // Featured values
    case "true":
      return <Star className="size-3.5 text-yellow-500 fill-yellow-500" />;
    case "false":
      return <Star className="size-3.5 text-muted-foreground" />;
    // Default icon for other values
    default:
      if (typeof type === "string") {
        // Generate a consistent color based on the string
        const hash = type
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return (
          <div className={`bg-[hsl(${hue},70%,60%)] rounded-full size-2.5`} />
        );
      }
      return <Circle className="size-3.5 text-muted-foreground" />;
  }
};

export const filterViewOptions: FilterOption[][] = [
  [
    {
      name: FilterType.CATEGORY,
      icon: <FilterIcon type={FilterType.CATEGORY} />,
    },
    {
      name: FilterType.FEATURED,
      icon: <FilterIcon type={FilterType.FEATURED} />,
    },
    {
      name: FilterType.TAGS,
      icon: <FilterIcon type={FilterType.TAGS} />,
    },
  ],
];

export const statusFilterOptions: FilterOption[] = Object.values(Status).map(
  (status) => ({
    name: status,
    icon: <FilterIcon type={status} />,
  })
);

export const assigneeFilterOptions: FilterOption[] = Object.values(
  Assignee
).map((assignee) => ({
  name: assignee,
  icon: <FilterIcon type={assignee} />,
}));

export const labelFilterOptions: FilterOption[] = Object.values(Labels).map(
  (label) => ({
    name: label,
    icon: <FilterIcon type={label} />,
  })
);

export const priorityFilterOptions: FilterOption[] = Object.values(
  Priority
).map((priority) => ({
  name: priority,
  icon: <FilterIcon type={priority} />,
}));

export const dateFilterOptions: FilterOption[] = Object.values(DueDate).map(
  (date) => ({
    name: date,
    icon: undefined,
  })
);

export const filterViewToFilterOptions: Record<FilterType, FilterOption[]> = {
  [FilterType.CATEGORY]: [],
  [FilterType.FEATURED]: [],
  [FilterType.TAGS]: [],
};

const filterOperators = ({
  filterType,
  filterValues,
}: {
  filterType: FilterType;
  filterValues: string[];
}) => {
  switch (filterType) {
    case FilterType.CATEGORY:
    case FilterType.FEATURED:
    case FilterType.TAGS:
      if (Array.isArray(filterValues) && filterValues.length > 1) {
        return [FilterOperator.IS_ANY_OF, FilterOperator.IS_NOT];
      } else {
        return [FilterOperator.IS, FilterOperator.IS_NOT];
      }

    default:
      return [];
  }
};

const FilterOperatorDropdown = ({
  filterType,
  operator,
  filterValues,
  setOperator,
}: {
  filterType: FilterType;
  operator: FilterOperator;
  filterValues: string[];
  setOperator: (operator: FilterOperator) => void;
}) => {
  const operators = filterOperators({ filterType, filterValues });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-muted hover:bg-muted/50 px-1.5 py-1 text-muted-foreground hover:text-primary transition shrink-0">
        {operator}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit min-w-fit">
        {operators.map((operator) => (
          <DropdownMenuItem
            key={operator}
            onClick={() => setOperator(operator)}
          >
            {operator}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Filters({
  filters,
  setFilters,
}: {
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
}) {
  return (
    <div className="flex gap-2">
      {filters
        .filter((filter) => filter.value?.length > 0)
        .map((filter) => (
          <div key={filter.id} className="flex gap-[1px] items-center text-xs">
            <div className="flex gap-1.5 shrink-0 rounded-l bg-muted px-1.5 py-1 items-center">
              <FilterIcon type={filter.type} />
              {filter.type}
            </div>
            <FilterOperatorDropdown
              filterType={filter.type}
              operator={filter.operator}
              filterValues={filter.value}
              setOperator={(operator) => {
                setFilters((prev) =>
                  prev.map((f) => (f.id === filter.id ? { ...f, operator } : f))
                );
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setFilters((prev) => prev.filter((f) => f.id !== filter.id));
              }}
              className="bg-muted rounded-l-none rounded-r-sm h-6 w-6 text-muted-foreground hover:text-primary hover:bg-muted/50 transition shrink-0"
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}
    </div>
  );
}
