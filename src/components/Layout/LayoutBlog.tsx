/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import sidebarBlog from 'sidebarBlog.json';
import {MarkdownPage, MarkdownProps} from './MarkdownPage';
import {Page} from './Page';
import {RouteItem} from './useRouteMeta';

interface PageFrontmatter {
  title: string;
  status: string;
}

export default function withAPI(p: PageFrontmatter) {
  function LayoutAPI(props: MarkdownProps<PageFrontmatter>) {
    return <MarkdownPage {...props} meta={p} />;
  }
  LayoutAPI.appShell = AppShell;
  return LayoutAPI;
}

function AppShell(props: {children: React.ReactNode}) {
  return <Page routeTree={sidebarBlog as RouteItem} {...props} />;
}
