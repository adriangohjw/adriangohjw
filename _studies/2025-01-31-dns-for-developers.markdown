---
layout: study
title:  "DNS for Developers (nslookup.io)"
date:   2025-01-31 00:00:00 +0800
image: /assets/dns-for-developers/cover.png
categories: studies
tags: [dns]
---

Just jotting down some quick notes and learnings from the [video course](https://www.nslookup.io/dns-course/) by Ruurtjan Pul from nslookup.io.

![](/assets/dns-for-developers/cover.png)

## Design goals

| Goals | Description | Design pattern |
|-------|-------------|---------------|
| Multi-tenant | Useable by independent entities | Federation (allows multiple DB to function as one) |
| Fault-tolerant | No single point of failure | Replication |
| Scalable | Because the internet grows | Distributed |
| Performant | Slow responses lead to slow applications | Caching |

## Root zones

- 13 root servers because 14th wouldn't fit in a single DNS UDP packet
- They are "well known" and built into DNS resolvers and operating systems
- If one doesn't respond, it will try another -> 12/13 can go down and internet would still work
- Each runs on Anycast network - this allows multiple servers to listen on the same IP address

![](/assets/dns-for-developers/root-servers.png)

## Zone delegation

```bash
dig linkedin-queens-game-solver.adriangohjw.com +trace +nodnssec

; <<>> DiG 9.10.6 <<>> linkedin-queens-game-solver.adriangohjw.com +trace +nodnssec
;; global options: +cmd
.                       512043  IN      NS      b.root-servers.net.
.                       512043  IN      NS      c.root-servers.net.
.                       512043  IN      NS      d.root-servers.net.
.                       512043  IN      NS      e.root-servers.net.
.                       512043  IN      NS      f.root-servers.net.
.                       512043  IN      NS      g.root-servers.net.
.                       512043  IN      NS      h.root-servers.net.
.                       512043  IN      NS      i.root-servers.net.
.                       512043  IN      NS      j.root-servers.net.
.                       512043  IN      NS      k.root-servers.net.
.                       512043  IN      NS      l.root-servers.net.
.                       512043  IN      NS      m.root-servers.net.
.                       512043  IN      NS      a.root-servers.net.
;; Received 811 bytes from 103.7.200.10#53(103.7.200.10) in 4 ms

com.                    172800  IN      NS      g.gtld-servers.net.
com.                    172800  IN      NS      j.gtld-servers.net.
com.                    172800  IN      NS      l.gtld-servers.net.
com.                    172800  IN      NS      b.gtld-servers.net.
com.                    172800  IN      NS      d.gtld-servers.net.
com.                    172800  IN      NS      e.gtld-servers.net.
com.                    172800  IN      NS      k.gtld-servers.net.
com.                    172800  IN      NS      f.gtld-servers.net.
com.                    172800  IN      NS      h.gtld-servers.net.
com.                    172800  IN      NS      i.gtld-servers.net.
com.                    172800  IN      NS      m.gtld-servers.net.
com.                    172800  IN      NS      c.gtld-servers.net.
com.                    172800  IN      NS      a.gtld-servers.net.
;; Received 871 bytes from 192.36.148.17#53(i.root-servers.net) in 15 ms

adriangohjw.com.        172800  IN      NS      kara.ns.cloudflare.com.
adriangohjw.com.        172800  IN      NS      carlos.ns.cloudflare.com.
;; Received 390 bytes from 192.55.83.30#53(m.gtld-servers.net) in 69 ms

linkedin-queens-game-solver.adriangohjw.com. 300 IN A 104.21.64.1
linkedin-queens-game-solver.adriangohjw.com. 300 IN A 104.21.48.1
linkedin-queens-game-solver.adriangohjw.com. 300 IN A 104.21.80.1
linkedin-queens-game-solver.adriangohjw.com. 300 IN A 104.21.16.1
linkedin-queens-game-solver.adriangohjw.com. 300 IN A 104.21.96.1
linkedin-queens-game-solver.adriangohjw.com. 300 IN A 104.21.112.1
linkedin-queens-game-solver.adriangohjw.com. 300 IN A 104.21.32.1
;; Received 184 bytes from 108.162.192.123#53(kara.ns.cloudflare.com) in 5 ms
```
    
1. First, we get a list of all 13 root DNS servers.
2. Our resolver picks one root server (`i.root-servers.net`) to query for the `.com` TLD nameservers
3. From the `.com` TLD nameservers received, it queries `m.gtld-servers.net` to find nameservers for `adriangohjw.com`. The query returns Cloudflare's nameservers (`kara.ns.cloudflare.com` and `carlos.ns.cloudflare.com`)
4. Finally, querying `kara.ns.cloudflare.com` gives us seven A records (IP addresses) for `linkedin-queens-game-solver.adriangohjw.com`
5. The resolver picks one of the IP addresses and uses it to connect to the server.

## Authorative DNS servers

- Every DNS zone must have at least 2 name servers to serve its DNS records.
- They are "authoritative NS" because they are the only servers trusted to reply with the correct DNS records for that zone.
- For example, `adriangohjw.com` has Cloudflare's name servers as its authoritative NS.

```bash
dig adriangohjw.com SOA

;; QUESTION SECTION:
;adriangohjw.com.               IN      SOA

;; ANSWER SECTION:
adriangohjw.com.        1772    IN      SOA     carlos.ns.cloudflare.com. dns.cloudflare.com. 2364141204 10000 2400 604800 1800
```