"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Github,
  ExternalLink,
  Calendar,
  Star,
  ListFilter,
  FolderKanban,
  Tags,
  Layers,
  Server,
  Database,
  Brain,
  Lock,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import Filters, {
  FilterType,
  FilterOperator,
  FilterOption,
  filterViewToFilterOptions,
  filterViewOptions,
  AnimateChangeInHeight,
  Filter,
} from "@/components/ui/filters";
import { cn } from "@/lib/utils";

import type { Project } from "@/lib/github";
// Import uuid for generating unique IDs
import { v4 as uuidv4 } from "uuid";

// Define constants for our filter types to use throughout the component
const CATEGORY_FILTER = FilterType.CATEGORY;
const FEATURED_FILTER = FilterType.FEATURED;
const TAGS_FILTER = FilterType.TAGS;

interface ProjectsGridProps {
  initialProjects: Project[];
}

// Custom type for our project filter options that works with the existing FilterOption type
interface ProjectFilterOption {
  name: string;
  icon: React.ReactNode | null;
  label: string;
}

export default function ProjectsGrid({ initialProjects }: ProjectsGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<FilterType | null>(null);
  const [commandInput, setCommandInput] = useState("");
  const commandInputRef = React.useRef<HTMLInputElement>(null);

  // Get all unique categories from projects
  const allCategories = Array.from(
    new Set(initialProjects.flatMap((project) => project.category || []))
  );

  // Get all unique tags from projects
  const allTags = Array.from(
    new Set(initialProjects.flatMap((project) => project.tags || []))
  );

  // Create custom filter options for our project data
  const categoryFilterOptions: ProjectFilterOption[] = allCategories.map(
    (category) => {
      let icon;
      switch (category) {
        case "frontend":
          icon = <Layers className="h-3 w-3 text-indigo-500" />;
          break;
        case "backend":
          icon = <Server className="h-3 w-3 text-green-600" />;
          break;
        case "infrastructure":
          icon = <Database className="h-3 w-3 text-amber-600" />;
          break;
        case "AI":
          icon = <Brain className="h-3 w-3 text-purple-600" />;
          break;
        default:
          icon = <FolderKanban className="h-3 w-3 text-blue-500" />;
      }

      return {
        name: category,
        icon,
        label: category,
      };
    }
  );

  const tagFilterOptions: ProjectFilterOption[] = allTags.map((tag) => {
    let icon;
    // Assign specific icons based on common tags
    switch (tag) {
      case "TypeScript":
      case "Typescript":
        icon = <div className="bg-blue-500 rounded-full h-2.5 w-2.5" />;
        break;
      case "JavaScript":
      case "Javascript":
        icon = <div className="bg-yellow-400 rounded-full h-2.5 w-2.5" />;
        break;
      case "Python":
        icon = <div className="bg-green-500 rounded-full h-2.5 w-2.5" />;
        break;
      case "Rust":
        icon = <div className="bg-orange-600 rounded-full h-2.5 w-2.5" />;
        break;
      case "Go":
        icon = <div className="bg-cyan-500 rounded-full h-2.5 w-2.5" />;
        break;
      case "React":
        icon = <div className="bg-blue-400 rounded-full h-2.5 w-2.5" />;
        break;
      case "Next.js":
        icon = <div className="bg-black rounded-full h-2.5 w-2.5" />;
        break;
      case "Blockchain":
        icon = <div className="bg-purple-400 rounded-full h-2.5 w-2.5" />;
        break;
      case "Cosmos":
        icon = <div className="bg-indigo-500 rounded-full h-2.5 w-2.5" />;
        break;
      default:
        // Generate a consistent color based on the tag name
        const hash = tag
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        icon = (
          <div
            className={`bg-[hsl(${hue},70%,60%)] rounded-full h-2.5 w-2.5`}
          />
        );
    }

    return {
      name: tag,
      icon,
      label: tag,
    };
  });

  const featuredFilterOptions: ProjectFilterOption[] = [
    {
      name: "true",
      icon: <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />,
      label: "Yes",
    },
    {
      name: "false",
      icon: <Star className="h-3 w-3 text-muted-foreground" />,
      label: "No",
    },
  ];

  // Create custom filter view options for our project filters
  const projectFilterViewOptions: FilterOption[] = [
    {
      name: CATEGORY_FILTER,
      icon: <FolderKanban className="h-3 w-3 text-blue-500" />,
    },
    {
      name: TAGS_FILTER,
      icon: <Tags className="h-3 w-3 text-purple-500" />,
    },
    {
      name: FEATURED_FILTER,
      icon: <Star className="h-3 w-3 text-yellow-500" />,
    },
  ];

  // Extend the filterViewToFilterOptions with our custom filter options
  useEffect(() => {
    // Add our custom filter options to the existing filterViewToFilterOptions
    (filterViewToFilterOptions as Record<string, FilterOption[]>)[
      CATEGORY_FILTER
    ] = categoryFilterOptions as unknown as FilterOption[];
    (filterViewToFilterOptions as Record<string, FilterOption[]>)[TAGS_FILTER] =
      tagFilterOptions as unknown as FilterOption[];
    (filterViewToFilterOptions as Record<string, FilterOption[]>)[
      FEATURED_FILTER
    ] = featuredFilterOptions as unknown as FilterOption[];

    // Add our custom filter types to the filterViewOptions only if they don't already exist
    if (filterViewOptions.length > 0) {
      // Check if our custom filter group already exists
      const customFilterGroupExists = filterViewOptions.some((group) =>
        group.some(
          (filter) =>
            filter.name === CATEGORY_FILTER ||
            filter.name === TAGS_FILTER ||
            filter.name === FEATURED_FILTER
        )
      );

      // Only add our custom filter options if they don't already exist
      if (!customFilterGroupExists) {
        filterViewOptions.push(
          projectFilterViewOptions as unknown as FilterOption[]
        );
      }
    }
  }, [
    allCategories,
    allTags,
    categoryFilterOptions,
    tagFilterOptions,
    featuredFilterOptions,
  ]);

  // Filter projects based on filters and search term
  const filteredProjects = initialProjects.filter((project) => {
    // Check if project matches all filters
    const matchesFilters =
      filters.length === 0 ||
      filters.every((filter) => {
        // Cast the filter type to our custom ProjectFilterType for comparison
        const filterType = filter.type as unknown as string;

        switch (filterType) {
          case CATEGORY_FILTER:
            switch (filter.operator) {
              case FilterOperator.IS:
              case FilterOperator.INCLUDE:
                return project.category?.includes(filter.value[0]);
              case FilterOperator.IS_NOT:
              case FilterOperator.DO_NOT_INCLUDE:
                return !project.category?.includes(filter.value[0]);
              case FilterOperator.INCLUDE_ANY_OF:
                return filter.value.some((val) =>
                  project.category?.includes(val)
                );
              case FilterOperator.INCLUDE_ALL_OF:
                return filter.value.every((val) =>
                  project.category?.includes(val)
                );
              default:
                return true;
            }
          case FEATURED_FILTER:
            switch (filter.operator) {
              case FilterOperator.IS:
                return project.featured === (filter.value[0] === "true");
              case FilterOperator.IS_NOT:
                return project.featured !== (filter.value[0] === "true");
              default:
                return true;
            }
          case TAGS_FILTER:
            switch (filter.operator) {
              case FilterOperator.INCLUDE:
              case FilterOperator.IS:
                return project.tags.includes(filter.value[0]);
              case FilterOperator.DO_NOT_INCLUDE:
              case FilterOperator.IS_NOT:
                return !project.tags.includes(filter.value[0]);
              case FilterOperator.INCLUDE_ANY_OF:
                return filter.value.some((val) => project.tags.includes(val));
              case FilterOperator.INCLUDE_ALL_OF:
                return filter.value.every((val) => project.tags.includes(val));
              default:
                return true;
            }
          default:
            return true;
        }
      });

    // Check if project matches search term
    const matchesSearch =
      searchTerm === ""
        ? true
        : project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.description?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (Array.isArray(project.tags) &&
            project.tags.some((tag: string) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ));

    return matchesFilters && matchesSearch;
  });

  // Add a new filter
  const addFilter = (type: string, value: string) => {
    // Create a custom filter with appropriate values based on type
    const newFilter: Filter = {
      id: uuidv4(),
      type: type as unknown as FilterType,
      operator: FilterOperator.IS,
      value: [value],
    };
    setFilters([...filters, newFilter]);
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-12">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="w-full sm:w-96">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2 flex-wrap">
                <Filters filters={filters} setFilters={setFilters} />
                {filters.filter((filter) => filter.value?.length > 0).length >
                  0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition group h-6 text-xs items-center rounded-sm"
                    onClick={() => setFilters([])}
                  >
                    Clear
                  </Button>
                )}
                <Popover
                  open={open}
                  onOpenChange={(open) => {
                    setOpen(open);
                    if (!open) {
                      setTimeout(() => {
                        setSelectedView(null);
                        setCommandInput("");
                      }, 200);
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      role="combobox"
                      aria-expanded={open}
                      size="sm"
                      className={cn(
                        "transition group h-6 text-xs items-center rounded-sm flex gap-1.5 items-center",
                        filters.length > 0 && "w-6"
                      )}
                    >
                      <ListFilter className="size-3 shrink-0 transition-all text-muted-foreground group-hover:text-primary" />
                      {!filters.length && "Filter"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <AnimateChangeInHeight>
                      <Command>
                        <CommandInput
                          placeholder={
                            selectedView
                              ? (selectedView as string)
                              : "Filter..."
                          }
                          className="h-9"
                          value={commandInput}
                          onInputCapture={(e) => {
                            setCommandInput(e.currentTarget.value);
                          }}
                          ref={commandInputRef}
                        />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          {selectedView ? (
                            <CommandGroup>
                              {(
                                filterViewToFilterOptions as Record<
                                  string,
                                  FilterOption[]
                                >
                              )[selectedView as string]?.map(
                                (filter: FilterOption) => (
                                  <CommandItem
                                    className="group text-muted-foreground flex gap-2 items-center"
                                    key={filter.name as string}
                                    value={filter.name as string}
                                    onSelect={(currentValue) => {
                                      setFilters((prev) => [
                                        ...prev,
                                        {
                                          id: uuidv4(),
                                          type: selectedView,
                                          operator: FilterOperator.IS,
                                          value: [currentValue],
                                        },
                                      ]);
                                      setTimeout(() => {
                                        setSelectedView(null);
                                        setCommandInput("");
                                      }, 200);
                                      setOpen(false);
                                    }}
                                  >
                                    {filter.icon}
                                    <span className="text-accent-foreground">
                                      {filter.label || filter.name}
                                    </span>
                                  </CommandItem>
                                )
                              )}
                            </CommandGroup>
                          ) : (
                            filterViewOptions.map(
                              (group: FilterOption[], index: number) => (
                                <React.Fragment key={index}>
                                  <CommandGroup>
                                    {group.map((filter: FilterOption) => (
                                      <CommandItem
                                        className="group text-muted-foreground flex gap-2 items-center"
                                        key={filter.name as string}
                                        value={filter.name as string}
                                        onSelect={(currentValue) => {
                                          setSelectedView(
                                            currentValue as FilterType
                                          );
                                          setCommandInput("");
                                          commandInputRef.current?.focus();
                                        }}
                                      >
                                        {filter.icon}
                                        <span className="text-accent-foreground">
                                          {filter.name}
                                        </span>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                  {index < filterViewOptions.length - 1 && (
                                    <CommandSeparator />
                                  )}
                                </React.Fragment>
                              )
                            )
                          )}
                        </CommandList>
                      </Command>
                    </AnimateChangeInHeight>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader className="flex-none">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(project.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => {
                        // Add a tag filter when clicking on a tag
                        const existingFilter = filters.find(
                          (f) =>
                            (f.type as unknown as string) === TAGS_FILTER &&
                            f.value.includes(tag)
                        );
                        if (!existingFilter) {
                          addFilter(TAGS_FILTER, tag);
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.category?.map((cat: string) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className="capitalize cursor-pointer hover:bg-muted/80"
                      onClick={() => {
                        // Add a category filter when clicking on a category
                        const existingFilter = filters.find(
                          (f) =>
                            (f.type as unknown as string) === CATEGORY_FILTER &&
                            f.value.includes(cat)
                        );
                        if (!existingFilter) {
                          addFilter(CATEGORY_FILTER, cat);
                        }
                      }}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
                {project.featured && (
                  <Badge
                    variant="default"
                    className="mb-4 cursor-pointer hover:bg-primary/80"
                    onClick={() => {
                      // Add a featured filter when clicking on the featured badge
                      const existingFilter = filters.find(
                        (f) =>
                          (f.type as unknown as string) === FEATURED_FILTER &&
                          f.value.includes("true")
                      );
                      if (!existingFilter) {
                        addFilter(FEATURED_FILTER, "true");
                      }
                    }}
                  >
                    Featured
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>{project.stars}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex space-x-4">
                  {project.isPrivate ? (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Lock className="h-5 w-5" />
                      <span className="text-xs font-medium">Coming Soon!</span>
                    </span>
                  ) : (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`GitHub repository for ${project.title}`}
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`Live demo for ${project.title}`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/portfolio/${project.id}`}>Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground">
              No projects match your filters. Try adjusting your search
              criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFilters([]);
                setSearchTerm("");
              }}
              className="mt-4"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
