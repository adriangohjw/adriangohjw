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

```bash
dig adriangohjw.com NS +short

carlos.ns.cloudflare.com.
kara.ns.cloudflare.com.
```

## Zone transfers

- Designed with a leader/follower model (primary/secondary)
- All servers should reply with the same DNS data. It's kept in sync through a process called zone transfers.
- FYI: Many DNS providers do not actually use zone transfer but their own proprietary database replication mechanism.

```bash
dig adriangohjw.com SOA +short

adriangohjw.com.        1772    IN      SOA     carlos.ns.cloudflare.com. dns.cloudflare.com. 2364141204 10000 2400 604800 1800
```

![](/assets/dns-for-developers/soa-record-adriangohjw.png)

| Field | Description |
|-------|-------------|
| Name | Where the primary NS is hosted |
| Email | Email address of the administrator of the zone |
| Serial | The serial number of the zone. It's like a version number to see if the follower already has the most recent data. |
| Refresh | How often the secondary server should ask for updates |
| Retry | How often the secondary server should retry if the transfer fails |
| Expire | How long the secondary server should keep the zone in its cache |

### AXFR (Asynchronous Transfer Full Range)

- Used to transfer the entire zone from the primary to the secondary server.
- Response contains all DNS records for a domain, including internal hosts, subdomains, mail servers, and sometimes even private infrastructure.
- Example `dig adriangohjw.com AXFR`

### IXFR (Incremental Zone Transfer)

- Response contains only the changes to the zone, not the entire zone.
- Example `dig adriangohjw.com IXFR=2364141203` will return only the changes to the zone since the serial number 2364141203.

### Why are zone transfers not enabled by default?

Many DNS servers disable AXFR by default for security reasons:
1. **Exposed internal network topology** - Attackers can identify internal services that should not be exposed to the public internet
2. **Facilitate phising attack** - E.g. if they find `vpn.example.com`, they might create `vpn-secure.example.com` and phish users to input their credentials.
3. **DoS via large zone transfers** - high bandwidth usage

## Recursive v.s. Iterative queries

### Recursive Query

- DNS client requests that the DNS resolver fully resolves the domain name.
- Mainly used by end-users' devices as it obtain complete answers with minimal effort (does not require multiple queries)

![Recursive Query](/assets/dns-for-developers/recursive-query.png)
<p style="text-align: center;">Image source: <a href="https://threat.media/definition/what-is-a-recursive-dns-query/">threat.media</a></p>


### Iterative Query

- DNS client queries the DNS servers sequentially.
- Mainly used by DNS resolvers to methodically resolve domain names by consulting multiple servers.

![Iterative Query](/assets/dns-for-developers/iterative-query.png)
<p style="text-align: center;">Image source: <a href="https://threat.media/definition/what-is-an-iterative-dns-query/">threat.media</a></p>

## Glue records

- Why: help resolve domain names when the NS is within the same domain.
- For example, if `example.com` uses `ns1.example.com` as its name servers.
- Without glue records, the resolver will not be able to resolve `ns1.example.com` to its IP address as it's stuck in a loop.
- To add glue records, the registrar includes glue records (A/AAAA) at the parent DNS levels. 
- **If you see A/AAAA records in the "additional" section, those are the glue records.**

```bash
dig google.com NS

; <<>> DiG 9.10.6 <<>> google.com NS +additional
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 45537
;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 9

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;google.com.                    IN      NS

;; ANSWER SECTION:
google.com.             247628  IN      NS      ns3.google.com.
google.com.             247628  IN      NS      ns1.google.com.
google.com.             247628  IN      NS      ns4.google.com.
google.com.             247628  IN      NS      ns2.google.com.

;; ADDITIONAL SECTION:
ns1.google.com.         247630  IN      A       216.239.32.10
ns1.google.com.         247633  IN      AAAA    2001:4860:4802:32::a
ns4.google.com.         247631  IN      A       216.239.38.10
ns4.google.com.         247634  IN      AAAA    2001:4860:4802:38::a
ns2.google.com.         247629  IN      A       216.239.34.10
ns2.google.com.         247630  IN      AAAA    2001:4860:4802:34::a
ns3.google.com.         247632  IN      A       216.239.36.10
ns3.google.com.         247628  IN      AAAA    2001:4860:4802:36::a
```

## DNS Caching

### Pros
1. **Faster** - Speed up future website access without needing to query the DNS server again.
2. **Less load on the DNS server** - Less DNS requests to the server.

### Cons
1. **Outdated DNS records** - If TTL is 1 hour, it means it might take up to 1 hour to update the DNS records locally.
2. **DNS poisoning** - Inserting malicious DNS records into the cache and redirecting users to malicious websites.
