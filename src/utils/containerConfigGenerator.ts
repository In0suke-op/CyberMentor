import { Lab, ContainerSecurityProfile, EphemeralContainerSession } from '../types';

export interface LabContainerSpec {
  image: string;
  containerName: string;
  defaultPort: number;
  exposedPort: number;
  environment: Record<string, string>;
  workdir: string;
  targetIp: string;
  securityProfile: ContainerSecurityProfile;
  initialFs: Record<string, { content: string; mode: number; owner: string }>;
  vulnerabilities: {
    type: string;
    description: string;
    solutionPattern: RegExp | string;
    rewardFlag: string;
  };
}

export const DEFAULT_SECURITY_PROFILE: ContainerSecurityProfile = {
  readOnlyRootfs: true,
  dropCapabilities: ['ALL'],
  addCapabilities: ['NET_BIND_SERVICE'],
  noNewPrivileges: true,
  seccompProfile: 'strict',
  user: '1001:1001',
  pidsLimit: 64,
  cpuQuota: '0.50',
  memoryLimit: '256m',
  networkMode: 'isolated-bridge'
};

export function getLabContainerSpec(lab: Lab): LabContainerSpec {
  switch (lab.id) {
    case 'lab-sqli-01':
      return {
        image: 'cybermentor/vuln-auth-portal:alpine-3.19',
        containerName: 'ctf-sqli-portal',
        defaultPort: 8080,
        exposedPort: 8080,
        targetIp: '10.10.42.15',
        workdir: '/app',
        environment: {
          NODE_ENV: 'production',
          PORT: '8080',
          DB_PATH: '/tmp/users.sqlite',
          FLAG_SECRET: 'FLAG{sqli_un10n_auth_byp4ss_m4st3r_2026}'
        },
        securityProfile: { ...DEFAULT_SECURITY_PROFILE, pidsLimit: 48, memoryLimit: '192m' },
        initialFs: {
          '/app/server.js': {
            content: `// Vulnerable authentication endpoint\napp.post('/api/login', (req, res) => {\n  const { username, password } = req.body;\n  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";\n  db.all(query, (err, rows) => { ... });\n});`,
            mode: 0o444,
            owner: 'root'
          },
          '/app/README.txt': {
            content: 'Authentication portal running on port 8080. Target input: username parameter in JSON payload.',
            mode: 0o644,
            owner: 'analyst'
          },
          '/tmp/version.log': {
            content: 'MicroAuth v2.4.1 (sqlite3 engine) - ephemeral worker running.',
            mode: 0o666,
            owner: 'analyst'
          }
        },
        vulnerabilities: {
          type: 'SQL Injection',
          description: 'Unsanitized string concatenation in SQL query allows tautology auth bypass',
          solutionPattern: /(' OR '1'='1|admin' --|admin' OR 1=1--|' OR 1=1)/i,
          rewardFlag: 'FLAG{sqli_un10n_auth_byp4ss_m4st3r_2026}'
        }
      };

    case 'lab-idor-02':
      return {
        image: 'cybermentor/medivault-api:slim-1.4',
        containerName: 'ctf-medivault-idor',
        defaultPort: 3000,
        exposedPort: 3000,
        targetIp: '10.10.42.20',
        workdir: '/var/www/api',
        environment: {
          API_VERSION: 'v1',
          MAX_CONNECTIONS: '100',
          PORT: '3000'
        },
        securityProfile: { ...DEFAULT_SECURITY_PROFILE, memoryLimit: '256m' },
        initialFs: {
          '/var/www/api/routes.json': {
            content: '{\n  "endpoints": [\n    "GET /api/v1/patients/:id",\n    "GET /api/v1/health"\n  ]\n}',
            mode: 0o644,
            owner: 'root'
          },
          '/home/analyst/notes.txt': {
            content: 'Cadet records start at ID 1042. Patient 1001 is reported to be an executive VIP record.',
            mode: 0o644,
            owner: 'analyst'
          }
        },
        vulnerabilities: {
          type: 'Insecure Direct Object Reference (IDOR)',
          description: 'API endpoint lacks authorization check when requesting records by numeric identifier',
          solutionPattern: /(1001|patient.*1001)/i,
          rewardFlag: 'FLAG{1d0r_h0r1z0nt4l_p4t13nt_3xf1l_992}'
        }
      };

    case 'lab-xss-03':
      return {
        image: 'cybermentor/guestbook-waf:v1.2',
        containerName: 'ctf-xss-guestbook',
        defaultPort: 80,
        exposedPort: 8000,
        targetIp: '10.10.42.35',
        workdir: '/var/www/html',
        environment: {
          ENABLE_BOT_VISITOR: 'true',
          HEADLESS_CHROME_ENABLED: 'true'
        },
        securityProfile: { ...DEFAULT_SECURITY_PROFILE, pidsLimit: 64 },
        initialFs: {
          '/var/www/html/index.php': {
            content: '<!-- Guestbook Comment Sanitizer: $clean = preg_replace("/<script>/i", "", $input); -->',
            mode: 0o644,
            owner: 'root'
          }
        },
        vulnerabilities: {
          type: 'Cross-Site Scripting (XSS)',
          description: 'Flawed single-pass tag stripping regex filter allows nested script tags or img/svg onerror payloads',
          solutionPattern: /(<scr<script>ipt>|onerror=|<svg.*onload=|<img.*onerror=)/i,
          rewardFlag: 'FLAG{xss_c00k13_th3ft_csp_3v4s10n_31337}'
        }
      };

    case 'lab-privesc-04':
      return {
        image: 'cybermentor/linux-privesc:debian-12',
        containerName: 'ctf-suid-privesc',
        defaultPort: 22,
        exposedPort: 2222,
        targetIp: '10.10.42.50',
        workdir: '/home/webuser',
        environment: {
          SHELL: '/bin/bash',
          CRON_SCHEDULE: '*/1 * * * * root /usr/local/bin/backup.sh'
        },
        securityProfile: {
          ...DEFAULT_SECURITY_PROFILE,
          readOnlyRootfs: false, // allows local file creation for exploit
          pidsLimit: 128
        },
        initialFs: {
          '/usr/local/bin/backup.sh': {
            content: '#!/bin/bash\ncd /var/backups\ntar -cf archive.tar *',
            mode: 0o755,
            owner: 'root'
          },
          '/etc/sudoers.d/webuser': {
            content: 'webuser ALL=(ALL) NOPASSWD: /usr/bin/find',
            mode: 0o440,
            owner: 'root'
          },
          '/root/flag.txt': {
            content: 'FLAG{su1d_t4r_w1ldc4rd_r00t_sh3ll_pwn3d}',
            mode: 0o400,
            owner: 'root'
          }
        },
        vulnerabilities: {
          type: 'Linux Privilege Escalation',
          description: 'Misconfigured SUID binary or tar wildcard execution grants root shell access',
          solutionPattern: /(--checkpoint=1|find.*-exec.*sh|\/root\/flag\.txt|cat.*flag\.txt)/i,
          rewardFlag: 'FLAG{su1d_t4r_w1ldc4rd_r00t_sh3ll_pwn3d}'
        }
      };

    default:
      return {
        image: 'cybermentor/kali-sandbox:minimal',
        containerName: `ctf-sandbox-${lab.id.replace(/[^a-z0-9]/g, '-')}`,
        defaultPort: 80,
        exposedPort: 8080,
        targetIp: '10.10.14.8',
        workdir: '/home/analyst',
        environment: {
          LAB_ID: lab.id,
          TARGET_SYSTEM: lab.targetSystem,
          USER: 'analyst'
        },
        securityProfile: DEFAULT_SECURITY_PROFILE,
        initialFs: {
          '/home/analyst/README.md': {
            content: `# ${lab.title}\n\n${lab.description}\n\nObjective: ${lab.objectives.join('; ')}`,
            mode: 0o644,
            owner: 'analyst'
          }
        },
        vulnerabilities: {
          type: 'Offensive Security Assessment',
          description: lab.scenario,
          solutionPattern: /flag/i,
          rewardFlag: 'FLAG{cybermentor_ctf_lab_verified_2026}'
        }
      };
  }
}

// -------------------------------------------------------------
// SECURE DOCKER ARTIFACT GENERATORS
// -------------------------------------------------------------

/**
 * Generates an audit-compliant, hardened Dockerfile
 */
export function generateDockerfile(lab: Lab, customProfile?: Partial<ContainerSecurityProfile>): string {
  const spec = getLabContainerSpec(lab);
  const profile = { ...spec.securityProfile, ...(customProfile || {}) };

  return `# ==============================================================================
# CyberMentor Ephemeral Lab Container: ${lab.title}
# Target System: ${lab.targetSystem}
# Security Classification: ISOLATED_EPHEMERAL_SANDBOX
# Generated: ${new Date().toISOString()}
# ==============================================================================

# STAGE 1: Minimal unprivileged runtime base
FROM ${spec.image} AS runtime

LABEL maintainer="CyberMentor Labs <security@cybermentor.io>"
LABEL lab.id="${lab.id}"
LABEL lab.category="${lab.category}"
LABEL sandbox.ephemeral="true"
LABEL security.read_only="${profile.readOnlyRootfs}"

# Configure unprivileged non-root service account
USER root
RUN if ! id -u 1001 >/dev/null 2>&1; then \\
      addgroup -g 1001 analyst && \\
      adduser -D -u 1001 -G analyst -h /home/analyst -s /bin/sh analyst; \\
    fi

# Enforce stripped permissions and ephemeral tmpfs target
WORKDIR ${spec.workdir}

# Populate initial simulated challenge artifacts
${Object.entries(spec.initialFs)
  .map(([path, file]) => {
    const escaped = file.content.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `RUN mkdir -p $(dirname ${path}) && echo "${escaped}" > ${path} && chmod ${file.mode.toString(8)} ${path} && chown ${file.owner}:${file.owner} ${path}`;
  })
  .join('\n')}

# Strip dangerous SUID bits unless explicitly needed by the challenge
${lab.id !== 'lab-privesc-04' ? 'RUN find / -perm /6000 -type f -exec chmod a-s {} + 2>/dev/null || true' : '# Preserving SUID binaries for privesc challenge objective'}

# Switch to unprivileged user by default
USER ${profile.user}

EXPOSE ${spec.exposedPort}

# Healthcheck to verify container readiness
HEALTHCHECK --interval=10s --timeout=3s --retries=3 --start-period=5s \\
  CMD ps aux | grep -v grep || exit 1

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["echo '[+] Ephemeral sandbox ready.' && while true; do sleep 3600; done"]
`;
}

/**
 * Generates an isolated, production-grade docker-compose.yml
 */
export function generateDockerCompose(lab: Lab, customProfile?: Partial<ContainerSecurityProfile>): string {
  const spec = getLabContainerSpec(lab);
  const profile = { ...spec.securityProfile, ...(customProfile || {}) };

  const envLines = Object.entries(spec.environment)
    .map(([k, v]) => `      - ${k}=${v}`)
    .join('\n');

  return `# ==============================================================================
# CyberMentor Ephemeral Lab Container Composition
# Hardened Orchestration Specification
# ==============================================================================
version: '3.8'

services:
  ${spec.containerName}:
    image: ${spec.image}
    container_name: ${spec.containerName}
    hostname: ${spec.containerName}
    user: "${profile.user}"
    restart: "no"
    
    # Resource Ceiling (prevents DoS, runaway forks, cryptominers)
    deploy:
      resources:
        limits:
          cpus: '${profile.cpuQuota}'
          memory: ${profile.memoryLimit}
          pids: ${profile.pidsLimit}
        reservations:
          cpus: '0.10'
          memory: 64M

    # Filesystem & Privilege Restrictions
    read_only: ${profile.readOnlyRootfs}
    security_opt:
      - no-new-privileges:true
      ${profile.seccompProfile === 'strict' ? '- seccomp:./seccomp-profile.json' : '- seccomp:unconfined'}

    # Linux Capability Dropping
    cap_drop:
${profile.dropCapabilities.map((c) => `      - ${c}`).join('\n')}
${
  profile.addCapabilities.length > 0
    ? `    cap_add:\n${profile.addCapabilities.map((c) => `      - ${c}`).join('\n')}`
    : '    # No additional capabilities granted'
}

    # Ephemeral In-Memory Storage (Tmpfs)
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=64m
      - /run:rw,noexec,nosuid,size=16m

    # Isolated Networking
    networks:
      ctf_isolated_net:
        ipv4_address: ${spec.targetIp}

    ports:
      - "127.0.0.1:${spec.exposedPort}:${spec.defaultPort}"

    environment:
${envLines}

    stop_grace_period: 5s

networks:
  ctf_isolated_net:
    driver: bridge
    internal: false
    ipam:
      driver: default
      config:
        - subnet: 10.10.42.0/24
          gateway: 10.10.42.1
`;
}

/**
 * Generates the single-line docker run CLI command with full security constraints
 */
export function generateDockerRunCommand(lab: Lab, customProfile?: Partial<ContainerSecurityProfile>): string {
  const spec = getLabContainerSpec(lab);
  const profile = { ...spec.securityProfile, ...(customProfile || {}) };

  const capDrop = profile.dropCapabilities.map((c) => `--cap-drop=${c}`).join(' ');
  const capAdd = profile.addCapabilities.map((c) => `--cap-add=${c}`).join(' ');
  const envVars = Object.entries(spec.environment)
    .map(([k, v]) => `-e ${k}="${v}"`)
    .join(' ');

  return `docker run --rm -it \\
  --name ${spec.containerName} \\
  --user ${profile.user} \\
  --cpus="${profile.cpuQuota}" \\
  --memory="${profile.memoryLimit}" \\
  --pids-limit=${profile.pidsLimit} \\
  ${profile.readOnlyRootfs ? '--read-only' : ''} \\
  --security-opt=no-new-privileges:true \\
  ${capDrop} \\
  ${capAdd} \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --tmpfs /run:rw,noexec,nosuid,size=16m \\
  -p 127.0.0.1:${spec.exposedPort}:${spec.defaultPort} \\
  ${envVars} \\
  ${spec.image}`;
}

/**
 * Generates an industry-standard Seccomp JSON profile
 */
export function generateSeccompJson(): string {
  return JSON.stringify(
    {
      defaultAction: 'SCMP_ACT_ERRNO',
      architectures: ['SCMP_ARCH_X86_64', 'SCMP_ARCH_AARCH64'],
      syscalls: [
        {
          names: [
            'read', 'write', 'open', 'openat', 'close', 'stat', 'fstat', 'lstat',
            'poll', 'lseek', 'mmap', 'mprotect', 'munmap', 'brk', 'rt_sigaction',
            'rt_sigprocmask', 'ioctl', 'access', 'pipe', 'select', 'sched_yield',
            'getpid', 'getuid', 'geteuid', 'getgid', 'getegid', 'socket', 'connect',
            'sendto', 'recvfrom', 'sendmsg', 'recvmsg', 'bind', 'listen', 'accept4',
            'getsockname', 'getpeername', 'setsockopt', 'getsockopt', 'clone', 'fork',
            'vfork', 'execve', 'exit', 'wait4', 'kill', 'uname', 'fcntl', 'flock',
            'fsync', 'getdents64', 'getcwd', 'chdir', 'mkdir', 'rmdir', 'unlink',
            'nanosleep', 'gettimeofday', 'clock_gettime'
          ],
          action: 'SCMP_ACT_ALLOW'
        },
        {
          names: [
            'ptrace', 'bpf', 'kexec_load', 'kexec_file_load', 'reboot',
            'init_module', 'finit_module', 'delete_module', 'mount', 'umount2',
            'pivot_root', 'swapon', 'swapoff', 'settimeofday', 'clock_settime',
            'acct', 'modify_ldt', 'vmsplice', 'userfaultfd', 'perf_event_open'
          ],
          action: 'SCMP_ACT_ERRNO'
        }
      ]
    },
    null,
    2
  );
}

// -------------------------------------------------------------
// CLIENT-SIDE EPHEMERAL VIRTUAL CONTAINER ENGINE
// -------------------------------------------------------------

export class BrowserVirtualContainer {
  public session: EphemeralContainerSession;
  private spec: LabContainerSpec;
  private fs: Map<string, string> = new Map();
  private pids: number = 4; // init, sh, logger, cron
  private commandHistory: string[] = [];
  private startTime: number = Date.now();
  private networkRx: number = 12.4;
  private networkTx: number = 8.1;

  constructor(lab: Lab, mode: 'browser-ephemeral' | 'backend-orchestrated' = 'browser-ephemeral') {
    this.spec = getLabContainerSpec(lab);

    // Initialize Virtual Filesystem
    this.fs.set('/etc/hostname', this.spec.containerName);
    this.fs.set('/etc/hosts', `127.0.0.1 localhost\n${this.spec.targetIp} ${this.spec.containerName}`);
    this.fs.set('/etc/issue', 'CyberMentor Sandboxed Container Environment (Alpine Linux 3.19 / GNU Coreutils)\n');
    this.fs.set('/etc/passwd', 'root:x:0:0:root:/root:/bin/sh\nanalyst:x:1001:1001:Analyst Cadet:/home/analyst:/bin/sh\nwebuser:x:1002:1002:Web Service:/var/www:/bin/false\n');
    this.fs.set('/proc/version', 'Linux version 6.6.15-cybermentor-sandbox (gcc 13.2.1) #1 SMP PREEMPT_DYNAMIC');
    this.fs.set('/proc/cpuinfo', `processor: 0\nmodel name: AMD EPYC Virtual Ephemeral Core (Quota: ${this.spec.securityProfile.cpuQuota} cores)\n`);

    Object.entries(this.spec.initialFs).forEach(([path, file]) => {
      this.fs.set(path, file.content);
    });

    this.session = {
      id: `cnt-${Math.random().toString(36).substring(2, 9)}`,
      labId: lab.id,
      containerName: this.spec.containerName,
      image: this.spec.image,
      status: 'running',
      mode,
      ipAddress: this.spec.targetIp,
      ports: { [this.spec.defaultPort]: this.spec.exposedPort },
      uptimeSeconds: 0,
      ttlSecondsRemaining: 1800, // 30 mins TTL
      securityProfile: this.spec.securityProfile,
      resourceUsage: {
        cpuPercent: 3.2,
        memoryMb: 48.6,
        memoryLimitMb: parseInt(this.spec.securityProfile.memoryLimit) || 256,
        pidCount: this.pids,
        networkRxKb: this.networkRx,
        networkTxKb: this.networkTx
      },
      logs: [
        `[KERNEL] Initializing isolated namespace pid_ns=4026531836, net_ns=4026531992`,
        `[CGROUPS] Memory limit enforced: ${this.spec.securityProfile.memoryLimit}, pids_limit=${this.spec.securityProfile.pidsLimit}`,
        `[SECCOMP] Loaded strict syscall filter (${this.spec.securityProfile.seccompProfile})`,
        `[SECCOMP] Dropped all capabilities: CAP_SYS_ADMIN, CAP_DAC_OVERRIDE, CAP_NET_ADMIN...`,
        `[CONTAINER] Mounting read-only rootfs: ${this.spec.securityProfile.readOnlyRootfs}`,
        `[CONTAINER] Spawning worker process as UID=${this.spec.securityProfile.user} on ${this.spec.targetIp}:${this.spec.defaultPort}`,
        `[CONTAINER] Ephemeral container running successfully. Time-to-Live: 30m00s.`
      ]
    };
  }

  public getUptimeSeconds(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  public execute(cmd: string): { output: string; exitCode: number } {
    const trimmed = cmd.trim();
    this.commandHistory.push(trimmed);
    this.networkRx += Math.round(Math.random() * 3 + 1);
    this.networkTx += Math.round(Math.random() * 2 + 1);

    // Update resource usage simulation
    this.session.resourceUsage.cpuPercent = Math.min(
      98,
      Math.max(2, Math.round(Math.random() * 15 + 5))
    );
    this.session.resourceUsage.networkRxKb = Number(this.networkRx.toFixed(1));
    this.session.resourceUsage.networkTxKb = Number(this.networkTx.toFixed(1));

    if (!trimmed) {
      return { output: '', exitCode: 0 };
    }

    // Command matching
    if (trimmed === 'help') {
      return {
        output: `CyberMentor Ephemeral Container Shell (v2.6.0)
Available standard utilities:
  curl, wget, nmap, sqlmap, id, whoami, uname, ps, env, cat, ls,
  grep, find, touch, rm, mkdir, echo, docker (ps/inspect/stats), clear, help
  
Security Hardening:
  • Read-only rootfs: ${this.session.securityProfile.readOnlyRootfs ? 'ENABLED' : 'DISABLED'}
  • Capability Dropping: ${this.session.securityProfile.dropCapabilities.join(', ')}
  • PIDs Limit: ${this.session.securityProfile.pidsLimit}
  • Seccomp Filter: ${this.session.securityProfile.seccompProfile}`,
        exitCode: 0
      };
    }

    if (trimmed === 'id') {
      return {
        output: `uid=1001(analyst) gid=1001(analyst) groups=1001(analyst),27(sudo) context=unconfined_u:unconfined_r:container_t:s0:c102,c405`,
        exitCode: 0
      };
    }

    if (trimmed === 'whoami') {
      return { output: 'analyst', exitCode: 0 };
    }

    if (trimmed === 'uname' || trimmed === 'uname -a') {
      return {
        output: `Linux ${this.spec.containerName} 6.6.15-cybermentor-ephemeral #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`,
        exitCode: 0
      };
    }

    if (trimmed.startsWith('env')) {
      const lines = Object.entries(this.spec.environment)
        .map(([k, v]) => `${k}=${v}`)
        .concat([
          'USER=analyst',
          'HOME=/home/analyst',
          'SHELL=/bin/sh',
          'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
          'CONTAINER_ID=' + this.session.id
        ]);
      return { output: lines.join('\n'), exitCode: 0 };
    }

    if (trimmed.startsWith('ps')) {
      return {
        output: `PID   USER     TIME  COMMAND
  1   root     0:00  /pause (sandbox init container)
 12   analyst  0:01  node ${this.spec.workdir}/server.js
 34   analyst  0:00  /bin/sh (interactive tty)
 48   analyst  0:00  ps ${trimmed.substring(2).trim()}`,
        exitCode: 0
      };
    }

    if (trimmed.startsWith('docker ps')) {
      return {
        output: `CONTAINER ID   IMAGE                                     COMMAND                  CREATED         STATUS         PORTS                    NAMES
${this.session.id.substring(4)}   ${this.spec.image}   "/bin/sh -c 'echo..."   ${Math.floor(this.getUptimeSeconds() / 60)}m ago      Up ${Math.floor(this.getUptimeSeconds() / 60)}m   0.0.0.0:${this.spec.exposedPort}->${this.spec.defaultPort}/tcp   ${this.spec.containerName}`,
        exitCode: 0
      };
    }

    if (trimmed.startsWith('docker stats')) {
      return {
        output: `CONTAINER ID   NAME                 CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           PIDS
${this.session.id.substring(4)}   ${this.spec.containerName}   ${this.session.resourceUsage.cpuPercent}%     ${this.session.resourceUsage.memoryMb}MiB / ${this.session.resourceUsage.memoryLimitMb}MiB   18.9%     ${this.networkRx}kB / ${this.networkTx}kB   ${this.pids}`,
        exitCode: 0
      };
    }

    if (trimmed.startsWith('docker inspect')) {
      return {
        output: JSON.stringify(
          {
            Id: this.session.id,
            Created: new Date(this.startTime).toISOString(),
            Path: '/bin/sh',
            State: {
              Status: 'running',
              Running: true,
              Paused: false,
              Restarting: false,
              OOMKilled: false,
              Dead: false,
              Pid: 18492,
              ExitCode: 0
            },
            Image: this.spec.image,
            HostConfig: {
              Memory: 268435456,
              NanoCpus: 500000000,
              PidsLimit: this.spec.securityProfile.pidsLimit,
              ReadonlyRootfs: this.spec.securityProfile.readOnlyRootfs,
              SecurityOpt: ['no-new-privileges:true', 'seccomp=strict'],
              CapDrop: this.spec.securityProfile.dropCapabilities
            },
            NetworkSettings: {
              IPAddress: this.spec.targetIp,
              Ports: { [`${this.spec.defaultPort}/tcp`]: [{ HostIp: '127.0.0.1', HostPort: `${this.spec.exposedPort}` }] }
            }
          },
          null,
          2
        ),
        exitCode: 0
      };
    }

    // Security violation simulation: test read-only rootfs or forbidden fork
    if (trimmed.startsWith('touch /bin/') || trimmed.startsWith('touch /etc/')) {
      if (this.session.securityProfile.readOnlyRootfs) {
        return {
          output: `touch: cannot touch '${trimmed.split(' ')[1]}': Read-only file system (docker read_only: true)`,
          exitCode: 1
        };
      }
    }

    if (trimmed.includes(':(){ :|:& };:')) {
      return {
        output: `[CONTAINER KERNEL] fork() failed: Resource temporarily unavailable\n[SECCOMP/CGROUP] Pids limit (${this.spec.securityProfile.pidsLimit}) prevented container exhaustion. Fork bomb neutralised.`,
        exitCode: 11
      };
    }

    // ls handling
    if (trimmed === 'ls' || trimmed.startsWith('ls ')) {
      const files = Array.from(this.fs.keys()).filter((k) => k.startsWith(this.spec.workdir));
      if (files.length > 0) {
        return {
          output: files.map((f) => f.replace(this.spec.workdir + '/', '')).join('   '),
          exitCode: 0
        };
      }
      return { output: 'README.md   exploit.py   notes.txt', exitCode: 0 };
    }

    // cat handling
    if (trimmed.startsWith('cat ')) {
      const target = trimmed.substring(4).trim();
      if (this.fs.has(target)) {
        return { output: this.fs.get(target)!, exitCode: 0 };
      }
      // Check relative
      const relative = `${this.spec.workdir}/${target}`;
      if (this.fs.has(relative)) {
        return { output: this.fs.get(relative)!, exitCode: 0 };
      }
      if (target.includes('flag.txt') && target.startsWith('/root')) {
        if (this.spec.vulnerabilities.solutionPattern instanceof RegExp) {
          // Check if solution condition was simulated
          return {
            output: `cat: /root/flag.txt: Permission denied (analyst is not in sudoers for cat)`,
            exitCode: 13
          };
        }
      }
      return { output: `cat: ${target}: No such file or directory`, exitCode: 1 };
    }

    // Nmap Scanner Simulation
    if (trimmed.startsWith('nmap')) {
      return {
        output: `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().substring(0, 19)} UTC
Nmap scan report for ${this.spec.containerName} (${this.spec.targetIp})
Host is up (0.00012s latency).
Not shown: 997 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
${this.spec.defaultPort}/tcp open  http        ${this.spec.containerName} micro-service
22/tcp   open  ssh         OpenSSH 9.6p1 (Alpine Linux)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds`,
        exitCode: 0
      };
    }

    // SUID Search command
    if (trimmed.includes('-perm -4000') || trimmed.includes('-perm /4000')) {
      if (this.session.labId === 'lab-privesc-04') {
        return {
          output: `/usr/bin/find\n/usr/bin/passwd\n/bin/umount\n/bin/mount\n/usr/bin/newgrp\n[+] Vulnerable binary identified: /usr/bin/find has SUID flag set!`,
          exitCode: 0
        };
      }
      return {
        output: `/usr/bin/passwd\n/bin/umount\n/bin/mount`,
        exitCode: 0
      };
    }

    // Solution Verification: Check against lab vulnerability solution pattern
    const isSolution =
      typeof this.spec.vulnerabilities.solutionPattern === 'string'
        ? trimmed.includes(this.spec.vulnerabilities.solutionPattern)
        : this.spec.vulnerabilities.solutionPattern.test(trimmed);

    if (isSolution) {
      this.session.logs.push(`[EXPLOIT] Vulnerability triggered by command: ${trimmed}`);
      return {
        output: `[+] EXPLOIT SUCCESSFUL! Vulnerability confirmed: ${this.spec.vulnerabilities.type}
[+] Target response:
HTTP/1.1 200 OK
Server: ${this.spec.containerName} (Isolated Container)
Content-Type: application/json
Content-Length: 142

{
  "status": "success",
  "exploited": true,
  "flag": "${this.spec.vulnerabilities.rewardFlag}",
  "message": "CTF Flag captured! Paste this flag into the submission form on the right."
}`,
        exitCode: 0
      };
    }

    // Default command execution feedback
    return {
      output: `Executed: ${trimmed}\n[container@${this.spec.containerName}:${this.spec.workdir}]$ (Try running 'help' or test exploit inputs against ${this.spec.targetIp}:${this.spec.defaultPort})`,
      exitCode: 0
    };
  }
}
