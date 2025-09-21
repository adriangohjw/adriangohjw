---
layout: study
title:  "DNS for Developers (nslookup.io)"
date:   2025-01-31 00:00:00 +0800
image: /assets/dns-for-developers/cover.png
categories: studies
tags: [dns]
uncompleted: true
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

### Negative caching

- DNS server will cache the failed DNS request and return the cached result.
- Duration for which a negative response is cached: Lesser of 2 values in the SOA record (TTL + minimum TTL a.k.a negative TTL)

## EDNS (Extension Mechanisms for DNS)

- Enhances DNS capabilities by supporting larger message sizes and more features e.g. DNSSEC.
- FYI: Default in most modern DNS resolvers

### Pros (key features)

1. **Larger UDP packets** - 4096 bytes (default 512 bytes) - avoid TCP fallback, making DNS faster
2. **DNSSEC** - Make DNS more secure (cryptographic validation for DNS responses)
3. **Client subnet (ECS)** - Sends part of the user's IP to to help CDNs serve geo-optimized content
4. **Extensible** - Allows for new features to be added without breaking backward compatibility

### Cons

1. **Firewall issues** - Some firewalls block EDNS packets
2. **Increased attack surface** - Can be abused for DNS amplification attacks*

*\* Attacker can send multiple DNS requests to a server while spoofing the victim's IP address. The server, thinking these requests are legitimate, responds to the victim's IP. This overwhelms the victim's network with a flood of unsolicited responses, resulting in a DoS attack. Mitigation strategies include rate limiting, traffic filtering and network firewalls (block known malicious IPs).*

## Dynamic DNS responses

### Round-robin DNS

- Load balancing technique to distribute traffic evenly across multiple servers.
- **Pros**: Simple and easy
- **Cons**: Can actually be unequal distribution + Ignores server load
- E.g.
  - 1st request -> server 1
  - 2nd request -> server 2
  - 3rd request -> server 1
  - 4th request -> server 2
  - etc.

### Weighted round-robin DNS

- Similar to round-robin, but each server has a weight.
- **Pros**: More efficient resource utilization + Considers server load
- **Cons**: Static weights + More complex to implement
- E.g. server 1 has a weight of 1, server 2 has a weight of 2. Then
  - 1st request -> server 1
  - 2nd request -> server 1
  - 3rd request -> server 2
  - 4th request -> server 1
  - etc.

### Dynamic load balancing

- Actively monitors server load and adjusts the distribution accordingly.
- **Pros**: Real-time traffic management + More reliable
- **Cons**: More complex to implement + Requires more resources to monitor server load

### Split-horizon DNS

- **Pros**: More secure + customized access
- **Cons**: Compled to manage + Potential for misconfigurations
- Example: Making an internal website accessible only within the office network.

## Types of DNS records

| Type | Description | Example |
|------|-------------|---------|
| A | Maps a domain name to an IPv4 address | `192.0.2.1` |
| AAAA | Maps a domain name to an IPv6 address | `2001:db8:1:1:1:1:1:1` |
| CNAME | Maps a domain name to another domain name | `www.example.com.cdn.net` |
| TXT | Stores arbitrary text data | `v=spf1 +all` |

### A & AAAA

- If both A & AAAA present, a client can connect to either as DNS cannot dictate which one to use.

### CNAME

- No other records with the same name can exist.
- Building on the pointer above, only one CNAME record per domain (or subdomain) too.
- No CNAME allowed for NS and MX records
  - e.g. `mail.domain.com` MX record pointing to `mailserver.domain.com` cannot have a CNAME of `mailserver.domain.com`

| Common pitfall | Description |
|---------------|-------------|
| Having a loop | e.g. `www.domain.com` CNAME to `mail.domain.com` and CNAME back to `www.domain.com` |
| Pointing to a IP address | Because the IP e.g. `1.2.3.4` will be interpreted as a subdomain, not a IP address. |
| Setting a URL | e.g. `www.domain.com` CNAME to `https://domain.com/about` |

### TXT

- Mainly used to protect against spam and phishing
  - e.g. SPF, DKIM, DMARC, Domain Verification.
- Value cannot only contain 255 characters.

### SRV

- Specify the location of servers for specific services, including hostnames and ports.

```bash
dig _sip._tcp.example.com SRV

_sip._tcp.example.com. 86400 IN SRV 10 5 5060 sipserver.example.com.
```

| Field | Description | Example |
|-------|-------------|---------|
| Priority | Lower value = higher priority | 10 |
| Weight | Used to distribute traffic | 5 |
| Port | Port number | 5060 |
| Target | Hostname of the server | sipserver.example.com |


- By configuring multiple SRV records with different priorities and weights, you can load balance your SIP (Session Initiation Protocol) servers.

### PTR

- Reverse DNS lookup
- Maps an IP address to a domain name.

## Types of DNS records (Emails)

| Type | Description |
|------|-------------|
| MX | Maps a domain name to be the recipient of emails |
| SPF | Specifies who can send emails for a domain |
| DKIM | Allows senders to sign their emails (stronger proof than SPF) |
| DMARC | Specifies how strict the receiving email server should be about accepting emails |

### MX

- Maps a domain name to be the recipient of emails.
- The receiving email server will use the MX record to determine where to send the email.

```bash
dig adriangohjw.com MX

adriangohjw.com.        1772    IN      MX      10 mail.adriangohjw.com.
adriangohjw.com.        1772    IN      MX      20 mail2.adriangohjw.com.
```

| Field | Description |
|-------|-------------|
| Priority | Lower value = higher priority | 10 |
| Target | Hostname of the mail server | mail.adriangohjw.com |

- MX value cannot be a CNAME
- MX value cannot be an IP address

### TLSA (TLS Authentication)

- A user visiting a website checks the TLS certificate issued by a Certificate Authority (CA). But if an attacker is able to intercept the TLS handshake, they can issue a fake certificate.

#### DANE
- DANE (DNS-Based Authentication of Named Entities) is a protocol that allows website owners to publish their own certificate information in DNS, ensuring only the correct certificate is trusted. It store information such as:
  - Type of certificate (e.g. full certificate, public key, CA)
  - A fingerprint hash of the certificate
  - The certificate usage policy
- DANE requires DNSSEC to prevent man-in-the-middle DNS records tampering.

```bash
dig _443._tcp.example.com TLSA

_443._tcp.example.com. IN TLSA 3 1 1 2B5B3D6C...
```

| Field | Description |
|-------|-------------|
| Usage | 3 = certificate usage policy |
| Selector | 1 = selector |
| Matching Type | 1 = matching type |
| Certificate | 2B5B3D6C... = certificate hash |

This means:
- When a browser connects to `example.com` using port 443 (https), it checks the DNS for a TLSA record
- It verfieies that the server's public key matches the stored hash
- Rejects the connection if it doesn't match

![DANE](/assets/dns-for-developers/DANE.png)
<p style="text-align: center;">Image source: <a href="https://www.csa.gov.sg/resources/internet-hygiene-portal/information-resources/dane">CSA</a></p>

#### DANE Usage Scenarios

1. *Preventing Rogue CAs* - If a CA is compromised, browsers will reject the certificate because it doesn't match the TLSA record.
2. *Self-signed certificates* - You can published hash of your self-signed certificate in DNS
3. *SMTP Security* - Email servers using DANE for SMTP can verify TLS certificates via DNS.

### MTA-STS (Mail Transfer Agent Strict Transport Security)

- Enhances the security of email transmission between mail servers
- Note: it encrypts the transmission path, not the email content
- Done by enforcing the use of TLS encryption

![MTA-STS](/assets/dns-for-developers/mta-sts.png)

#### Step 1: MTA-STS DNS TXT Record

```bash
dig _mta-sts.google.com TXT

_mta-sts.google.com.    900     IN      TXT     "v=STSv1; id=20210803T010101;"
```

| Field | Description |
|-------|-------------|
| v | Version of the MTA-STS policy (STSv1) |
| id | Can be any string, but timestamp is common practice |

#### Step 2: MTA-STS Policy File

- Should be hosted on a web server accessible via HTTPS
- e.g. `https://mta-sts.google.com/.well-known/mta-sts.txt`

```txt
version: STSv1
mode: enforce
mx: smtp.google.com
mx: aspmx.l.google.com
mx: *.aspmx.l.google.com
max_age: 86400
```

| Field | Description |
|-------|-------------|
| version | Version of the MTA-STS policy (STSv1) |
| mode | enforce / testing / none |
| mx | Mail server to use (min. 1 required) |
| max_age | How long the policy is valid (86400 seconds = 1 day) |
