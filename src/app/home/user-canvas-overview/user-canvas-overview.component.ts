import { AfterViewInit, Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '../home.component';

interface CanvasNode {
  user: UserData;
  x: number;
  y: number;
  hue: number;
  ring: number;
}

@Component({
  selector: 'app-user-canvas-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-canvas-overview.component.html',
  styleUrl: './user-canvas-overview.component.scss',
})
export class UserCanvasOverviewComponent implements AfterViewInit, OnDestroy {
  users = input.required<UserData[]>();
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('overviewCanvas');
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      this.users();
      this.repaint();
    });
  }

  ngAfterViewInit(): void {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl) {
      return;
    }

    const target = canvasEl.parentElement ?? canvasEl;
    this.resizeObserver = new ResizeObserver(() => this.repaint());
    this.resizeObserver.observe(target);
    this.repaint();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private repaint(): void {
    const canvasRef = this.canvas();
    const canvasEl = canvasRef?.nativeElement;
    if (!canvasEl) {
      return;
    }

    const parent = canvasEl.parentElement;
    const width = parent?.clientWidth ?? 720;
    const height = parent?.clientHeight ?? 480;
    if (!width || !height) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const pixelWidth = Math.floor(width * dpr);
    const pixelHeight = Math.floor(height * dpr);
    if (canvasEl.width !== pixelWidth) {
      canvasEl.width = pixelWidth;
    }
    if (canvasEl.height !== pixelHeight) {
      canvasEl.height = pixelHeight;
    }
    canvasEl.style.width = `${width}px`;
    canvasEl.style.height = `${height}px`;

    const ctx = canvasEl.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.resetTransform?.();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    this.drawBackground(ctx, width, height);

    const users = this.users();
    if (!users.length) {
      this.drawEmptyState(ctx, width, height);
      return;
    }

    const nodes = this.computeNodes(users, width, height);
    this.drawRings(ctx, width, height, nodes);
    this.drawConnections(ctx, nodes, width, height);
    this.drawNodes(ctx, nodes);
    this.drawSummary(ctx, users, width, height);
  }

  private drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#111827');
    gradient.addColorStop(1, '#1f2937');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.1,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.6
    );
    glow.addColorStop(0, 'rgba(59, 130, 246, 0.28)');
    glow.addColorStop(1, 'rgba(17, 24, 39, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    const spacing = 36;
    ctx.beginPath();
    for (let x = 0; x <= width; x += spacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += spacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private drawEmptyState(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '600 20px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No users yet', width / 2, height / 2 - 10);
    ctx.font = '400 14px "Segoe UI", sans-serif';
    ctx.fillText('Add users to see the animated overview.', width / 2, height / 2 + 16);
  }

  private computeNodes(users: UserData[], width: number, height: number): CanvasNode[] {
    const count = users.length;
    if (!count) {
      return [];
    }

    const maxPerRing = 12;
    const ringCount = Math.ceil(count / maxPerRing) || 1;
    const baseRadiusX = Math.min(width, height) * 0.35;
    const baseRadiusY = Math.min(width, height) * 0.28;
    const centerX = width / 2;
    const centerY = height / 2;

    return users.map((user, index) => {
      const ring = Math.floor(index / maxPerRing);
      const ringIndex = index % maxPerRing;
      const remaining = count - ring * maxPerRing;
      const ringSize = Math.min(maxPerRing, remaining);
      const angle = ringSize === 1
        ? -Math.PI / 2
        : (ringIndex / ringSize) * Math.PI * 2 - Math.PI / 2;
      const radiusFactor = ringCount === 1 ? 1 : (ring + 1) / ringCount;
      const radiusX = baseRadiusX * radiusFactor;
      const radiusY = baseRadiusY * radiusFactor;
      const x = ringSize === 1 && ring === 0 ? centerX : centerX + Math.cos(angle) * radiusX;
      const y = ringSize === 1 && ring === 0 ? centerY : centerY + Math.sin(angle) * radiusY;
      const hue = ((index / count) * 360) % 360;
      return { user, x, y, hue, ring };
    });
  }

  private drawRings(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    nodes: CanvasNode[]
  ): void {
    if (!nodes.length) {
      return;
    }
    const centerX = width / 2;
    const centerY = height / 2;
    const ringLevels = Math.max(...nodes.map(node => node.ring)) + 1;
    const maxRadius = Math.min(width, height) * 0.35;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.setLineDash([6, 6]);
    for (let i = 1; i <= ringLevels; i += 1) {
      const radius = (maxRadius / ringLevels) * i;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(17, 24, 39, 0.8)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.min(width, height) * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  private drawConnections(
    ctx: CanvasRenderingContext2D,
    nodes: CanvasNode[],
    width: number,
    height: number
  ): void {
    if (!nodes.length) {
      return;
    }
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.save();
    ctx.lineWidth = 1.5;
    nodes.forEach((node, index) => {
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${node.hue}, 80%, 60%, 0.22)`;
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(node.x, node.y);
      ctx.stroke();

      if (nodes.length > 1) {
        const next = nodes[(index + 1) % nodes.length];
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${(node.hue + next.hue) / 2}, 80%, 65%, 0.16)`;
        const controlX = (node.x + next.x) / 2;
        const controlY = (node.y + next.y) / 2;
        ctx.quadraticCurveTo(controlX, controlY, next.x, next.y);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  private drawNodes(ctx: CanvasRenderingContext2D, nodes: CanvasNode[]): void {
    ctx.save();
    ctx.font = '600 14px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    nodes.forEach(node => {
      const radius = 18;
      const highlight = ctx.createRadialGradient(node.x, node.y, radius * 0.2, node.x, node.y, radius * 1.4);
      highlight.addColorStop(0, `hsla(${node.hue}, 90%, 70%, 0.9)`);
      highlight.addColorStop(1, 'rgba(17, 24, 39, 0.3)');

      ctx.beginPath();
      ctx.fillStyle = highlight;
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = `hsla(${node.hue}, 95%, 70%, 0.85)`;
      ctx.arc(node.x, node.y, radius - 2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fillText(node.user.username, node.x, node.y + radius + 10);
      ctx.font = '400 12px "Segoe UI", sans-serif';
      const meta = `${node.user.details.firstName} • ${node.user.address.state}`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(meta, node.x, node.y + radius + 26);
      ctx.font = '600 14px "Segoe UI", sans-serif';
    });

    ctx.restore();
  }

  private drawSummary(ctx: CanvasRenderingContext2D, users: UserData[], width: number, height: number): void {
    const totalStates = new Set(users.map(user => user.address.state)).size;
    const totalCities = new Set(users.map(user => user.address.city)).size;
    const averagePasswordLength = Math.round(
      users.reduce((acc, user) => acc + user.password.length, 0) / users.length
    );

    const domainCounts = new Map<string, number>();
    for (const user of users) {
      const domain = user.email.split('@')[1] ?? 'unknown';
      domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);
    }
    const sortedDomains = Array.from(domainCounts.entries()).sort((a, b) => b[1] - a[1]);
    const [topDomain, topDomainCount] = sortedDomains[0] ?? ['-', 0];

    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
    ctx.font = '700 22px "Segoe UI", sans-serif';
    ctx.fillText('User Insights', 24, 24);

    ctx.font = '500 14px "Segoe UI", sans-serif';
    const lines = [
      `Total users: ${users.length}`,
      `States represented: ${totalStates}`,
      `Cities represented: ${totalCities}`,
      `Average password length: ${averagePasswordLength}`,
      `Top email domain: ${topDomain} (${topDomainCount})`
    ];

    lines.forEach((line, index) => {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
      ctx.fillText(line, 24, 60 + index * 20);
    });

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '500 12px "Segoe UI", sans-serif';
    ctx.fillText(`Last update: ${new Date().toLocaleTimeString()}`, width - 24, height - 28);
    ctx.restore();
  }
}
