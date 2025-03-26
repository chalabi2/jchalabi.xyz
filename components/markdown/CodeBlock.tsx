"use client";

import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  coldarkCold,
  coldarkDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { ComponentPropsWithoutRef } from "react";
import { useTheme } from "next-themes";

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
};

export function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeProps) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only execute theme logic on the client side after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a consistent theme for server-side rendering to avoid hydration mismatch
  // Only switch to the actual theme after client-side hydration
  const isDark = mounted ? resolvedTheme === "dark" : false;
  const style = isDark ? coldarkDark : coldarkCold;

  return !inline && language ? (
    <div className="overflow-hidden rounded-lg">
      <SyntaxHighlighter
        // @ts-expect-error - Known type issue with react-syntax-highlighter
        style={style}
        language={language}
        PreTag="div"
        customStyle={{
          padding: "1rem",
          margin: 0,
          borderRadius: "0.5rem",
          background: "transparent",
        }}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={`${className} bg-transparent`} {...props}>
      {children}
    </code>
  );
}
