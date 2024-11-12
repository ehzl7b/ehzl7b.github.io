---
layout: "test.liquid"
title: "test"
permalink: "/{{ page.fileSlug | my_filter }}/"
---

# {{ site.title }}??

{{ page.fileSlug }}

{{ page.fileSlug | my_filter }}