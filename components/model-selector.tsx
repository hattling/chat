"use client";

<<<<<<< HEAD
import { memo, startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Database, Lock, Server } from "lucide-react";
import useSWR from "swr";
=======
import { memo, startTransition } from "react";
>>>>>>> upstream/main
import { saveChatModelAsCookie } from "@/app/(chat)/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
<<<<<<< HEAD
import type { DbStatus } from "@/hooks/use-model-capabilities";
import type { AdminConfigSummary } from "@/lib/types";
import { storage } from "@/lib/storage";
import { cn, fetcher } from "@/lib/utils";
=======
import type { AdminConfigSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
>>>>>>> upstream/main
import { CheckCircleFillIcon, ChevronDownIcon, CpuIcon } from "./icons";

type ModelSelectorProps = {
  selectedModel: string;
  adminConfig?: AdminConfigSummary | null;
  isLoading?: boolean;
  error?: string | null;
<<<<<<< HEAD
  dbStatus?: DbStatus | null;
=======
>>>>>>> upstream/main
  onModelChange: (model: string) => void;
  className?: string;
};

function PureModelSelector({
  selectedModel,
  adminConfig,
  isLoading = false,
  error,
<<<<<<< HEAD
  dbStatus,
  onModelChange,
  className,
}: ModelSelectorProps) {
  const router = useRouter();
  const [keyedProviders, setKeyedProviders] = useState<Set<string>>(new Set());
  const { data: serverKeysData } = useSWR<string[]>("/api/server-keys", fetcher, { refreshInterval: 30000 });
  const serverKeys = new Set<string>(serverKeysData ?? []);

  useEffect(() => {
    const readKeys = () => {
      const providers = storage.apiKeys.getConfiguredProviders();
      setKeyedProviders(new Set(providers));
    };
    readKeys();
    // Re-read when localStorage changes (e.g. key saved in another tab or settings page)
    window.addEventListener("storage", readKeys);
    return () => window.removeEventListener("storage", readKeys);
  }, []);

=======
  onModelChange,
  className,
}: ModelSelectorProps) {
>>>>>>> upstream/main
  // Handle loading and error states
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex h-8 items-center gap-2 rounded-lg border-0 bg-background px-2 text-foreground shadow-none",
          className
        )}
      >
        <CpuIcon size={16} />
        <span className="hidden font-medium text-muted-foreground text-xs sm:block">
          Loading...
        </span>
      </div>
    );
  }

<<<<<<< HEAD
  const dbDown = dbStatus && !dbStatus.ok ? dbStatus : null;

  // Only fall back to the error-only UI when there's no admin config to render.
  // If DB is offline but a fallback config was returned, fall through to the
  // normal dropdown so the user can still pick and chat with a model.
  if (!adminConfig) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex h-8 items-center gap-2 rounded-lg border-0 bg-background px-2 text-foreground shadow-none transition-colors hover:bg-accent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              className
            )}
          >
            <AlertTriangle size={16} className="text-amber-500" />
            <span className="hidden font-medium text-amber-500 text-xs sm:block">
              Config Error
            </span>
            <ChevronDownIcon size={16} />
          </button>
        </DropdownMenuTrigger>
      </DropdownMenu>
=======
  if (error || !adminConfig) {
    return (
      <div
        className={cn(
          "flex h-8 items-center gap-2 rounded-lg border-0 bg-background px-2 text-foreground shadow-none",
          className
        )}
      >
        <CpuIcon size={16} />
        <span className="hidden font-medium text-muted-foreground text-xs sm:block">
          Config Error
        </span>
      </div>
>>>>>>> upstream/main
    );
  }

  // Group models by provider and ensure only one default per provider
  const providerGroups: Array<{
    providerId: string;
    providerName: string;
    enabled: boolean;
    models: Array<{
      id: string;
      name: string;
      description: string;
      provider: string;
      providerName: string;
      isDefault: boolean;
    }>;
  }> = [];

  Object.entries(adminConfig.providers || {}).forEach(
    ([providerId, providerConfig]) => {
<<<<<<< HEAD
=======
      if (!providerConfig.enabled) {
        return;
      }

>>>>>>> upstream/main
      const providerName =
        providerId.charAt(0).toUpperCase() + providerId.slice(1);
      const models: any[] = [];

<<<<<<< HEAD
      // Collect all models (enabled or not)
      Object.entries(providerConfig.models || {}).forEach(
        ([modelId, modelConfig]) => {
          models.push({
            id: modelId,
            name: modelConfig.name,
            description: modelConfig.description,
            provider: providerId,
            providerName,
            isDefault: modelConfig.isDefault,
          });
=======
      // First pass: collect all enabled models
      Object.entries(providerConfig.models || {}).forEach(
        ([modelId, modelConfig]) => {
          if (modelConfig.enabled) {
            models.push({
              id: modelId,
              name: modelConfig.name,
              description: modelConfig.description,
              provider: providerId,
              providerName,
              isDefault: modelConfig.isDefault,
            });
          }
>>>>>>> upstream/main
        }
      );

      // Second pass: ensure only one default per provider
      const defaultModels = models.filter((m) => m.isDefault);
      if (defaultModels.length > 1) {
        // If multiple defaults, keep only the first one
        models.forEach((model, index) => {
          if (model.isDefault && index > 0) {
            model.isDefault = false;
          }
        });
      } else if (defaultModels.length === 0 && models.length > 0) {
        // If no default, make the first model default
        models[0].isDefault = true;
      }

      // Sort models: default first, then by name
      models.sort((a, b) => {
        if (a.isDefault && !b.isDefault) {
          return -1;
        }
        if (!a.isDefault && b.isDefault) {
          return 1;
        }
        return a.name.localeCompare(b.name);
      });

<<<<<<< HEAD
      providerGroups.push({
        providerId,
        providerName,
        enabled: providerConfig.enabled,
        models,
      });
=======
      if (models.length > 0) {
        providerGroups.push({
          providerId,
          providerName,
          enabled: providerConfig.enabled,
          models,
        });
      }
>>>>>>> upstream/main
    }
  );

  // Sort provider groups by name
  providerGroups.sort((a, b) => a.providerName.localeCompare(b.providerName));

  // Find current selected model
  let currentModel: any = null;
  let currentProvider = "";

  for (const group of providerGroups) {
    const model = group.models.find((m) => m.id === selectedModel);
    if (model) {
      currentModel = model;
      currentProvider = group.providerName;
      break;
    }
  }

  // If no exact match, try partial matching
  if (!currentModel) {
    for (const group of providerGroups) {
      const model = group.models.find(
        (m) => m.id.includes(selectedModel) || selectedModel.includes(m.id)
      );
      if (model) {
        currentModel = model;
        currentProvider = group.providerName;
        break;
      }
    }
  }

  // If still no match, use the first default model or first model
  if (!currentModel && providerGroups.length > 0) {
    for (const group of providerGroups) {
      const defaultModel = group.models.find((m) => m.isDefault);
      if (defaultModel) {
        currentModel = defaultModel;
        currentProvider = group.providerName;
        break;
      }
    }

    // If no default found, use first model
    if (!currentModel) {
      currentModel = providerGroups[0].models[0];
      currentProvider = providerGroups[0].providerName;
    }
  }

<<<<<<< HEAD
  const handleModelSelection = (modelId: string, providerId: string) => {
    if (!keyedProviders.has(providerId) && !serverKeys.has(providerId)) {
      router.push("/settings");
      return;
    }
=======
  const handleModelSelection = (modelId: string) => {
>>>>>>> upstream/main
    onModelChange(modelId);
    startTransition(() => {
      saveChatModelAsCookie(modelId);
    });
  };

  return (
    <DropdownMenu>
<<<<<<< HEAD
      <DropdownMenuTrigger asChild id="key-model-selector">
=======
      <DropdownMenuTrigger asChild>
>>>>>>> upstream/main
        <button
          className={cn(
            "flex h-8 w-auto min-w-[200px] items-center gap-2 rounded-lg border-0 bg-background px-2 text-foreground shadow-none transition-colors hover:bg-accent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            className
          )}
        >
<<<<<<< HEAD
          {dbDown ? (
            <AlertTriangle size={16} className="text-amber-500" />
          ) : (
            <CpuIcon size={16} />
          )}
=======
          <CpuIcon size={16} />
>>>>>>> upstream/main
          <div className="flex items-center gap-2">
            <span className="hidden font-medium text-xs sm:block">
              {currentModel?.name || "Select Model"}
            </span>
            {currentModel && (
              <span className="hidden text-[10px] text-muted-foreground sm:block">
                ({currentProvider})
              </span>
            )}
<<<<<<< HEAD
            {dbDown && (
              <span className="hidden font-medium text-[10px] text-amber-500 sm:block">
                DB Offline
              </span>
            )}
=======
>>>>>>> upstream/main
          </div>
          <ChevronDownIcon size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-[400px] min-w-[320px] overflow-y-auto">
<<<<<<< HEAD
        {dbDown && (
          <div className="border-b border-border p-3">
            <div className="mb-2 flex items-start gap-2">
              <Database size={15} className="mt-0.5 flex-shrink-0 text-amber-500" />
              <p className="font-medium text-sm">{dbDown.message}</p>
            </div>
            <p className="mb-2 text-muted-foreground text-xs">
              Chats won't be saved until the database is restored.
            </p>
            <ol className="space-y-1.5">
              {dbDown.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-muted-foreground text-xs"
                >
                  <span className="flex-shrink-0 font-medium text-foreground">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        {providerGroups.map((group) => {
          const hasBrowserKey = keyedProviders.has(group.providerId);
          const hasServerKey = serverKeys.has(group.providerId);
          const hasKey = hasBrowserKey || hasServerKey;
          return (
            <div id={`key-provider-${group.providerId}`}>
            <DropdownMenuSub key={group.providerId}>
              <DropdownMenuSubTrigger
                className="flex items-center justify-between px-3 py-2"
                onClick={!hasKey ? () => router.push("/settings") : undefined}
              >
                <div className="flex items-center gap-2">
                  {hasBrowserKey ? (
                    <CheckCircleFillIcon size={13} />
                  ) : hasServerKey ? (
                    <Server size={13} className="text-muted-foreground" />
                  ) : (
                    <Lock size={13} className="text-muted-foreground" />
                  )}
                  <span className="font-medium text-sm">
                    {group.providerName}
                  </span>
                  <span className="text-muted-foreground/70 text-xs">
                    {group.models.length} model
                    {group.models.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="min-w-[280px]">
                  {group.models.map((model) => (
                    <DropdownMenuItem
                      id={`key-model-${model.id}`}
                      className={cn(
                        "h-auto cursor-pointer px-3 py-3 focus:bg-accent focus:text-accent-foreground",
                        !hasKey && "opacity-50"
                      )}
                      key={model.id}
                      onClick={() => handleModelSelection(model.id, group.providerId)}
                    >
                      <div className="flex w-full items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="truncate font-medium text-sm">
                              {model.name}
                            </span>
                            {model.isDefault && (
                              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="truncate text-muted-foreground text-xs leading-relaxed">
                            {!hasKey ? "Add key to use" : hasServerKey && !hasBrowserKey ? "Available via server .env" : model.description}
                          </div>
                        </div>
                        {selectedModel === model.id && hasKey && (
                          <div className="mt-0.5 flex-shrink-0 text-primary">
                            <CheckCircleFillIcon size={14} />
                          </div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {group.models.length === 0 && (
                    <div className="px-3 py-2 text-muted-foreground text-xs">
                      No models configured
                    </div>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            </div>
          );
        })}
=======
        {providerGroups.map((group) => (
          <DropdownMenuSub key={group.providerId}>
            <DropdownMenuSubTrigger className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {group.providerName}
                </span>
                <span className="text-muted-foreground/70 text-xs">
                  {group.models.length} model
                  {group.models.length !== 1 ? "s" : ""}
                </span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[280px]">
                {group.models.map((model) => (
                  <DropdownMenuItem
                    className="h-auto cursor-pointer px-3 py-3 focus:bg-accent focus:text-accent-foreground"
                    key={model.id}
                    onClick={() => handleModelSelection(model.id)}
                  >
                    <div className="flex w-full items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="truncate font-medium text-sm">
                            {model.name}
                          </span>
                          {model.isDefault && (
                            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="truncate text-muted-foreground text-xs leading-relaxed">
                          {model.description}
                        </div>
                      </div>
                      {selectedModel === model.id && (
                        <div className="mt-0.5 flex-shrink-0 text-primary">
                          <CheckCircleFillIcon size={14} />
                        </div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
>>>>>>> upstream/main

        {providerGroups.length === 0 && (
          <div className="px-2 py-4 text-center text-muted-foreground text-sm">
            No models available
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const ModelSelector = memo(PureModelSelector);
