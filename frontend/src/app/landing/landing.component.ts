import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Landing Page Component
 * Página principal de marketing para presentar la plataforma
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  readonly currentYear = new Date().getFullYear();

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  scrollTo(id: string): void {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  features = [
    {
      icon: 'business',
      title: 'Gestión Multi-Clínica',
      description: 'Administra múltiples consultorio desde un solo lugar. Escalabilidad total para tu red de servicios psicológicos.'
    },
    {
      icon: 'groups',
      title: 'Directorio de Terapeutas',
      description: 'Organiza tus profesionales, gestiona disponibilidad, y visualiza ocupación en tiempo real.'
    },
    {
      icon: 'description',
      title: 'Historiales Médicos Digitales',
      description: 'Almacena seguro los registros de tus pacientes. Acceso rápido a diagnósticos y antecedentes clínicos.'
    },
    {
      icon: 'assignment',
      title: 'Reportes Clínicos Inteligentes',
      description: 'Genera reportes detallados de progreso. Seguimiento automático de evolución del paciente.'
    },
    {
      icon: 'receipt',
      title: 'Sistema de Facturación Integrado',
      description: 'Crea facturas, gestiona pagos, y sincroniza con tu sistema contable. Todo en un solo lugar.'
    },
    {
      icon: 'trending_up',
      title: 'Analíticas y Reportes',
      description: 'Visualiza métricas de tu consultorio. KPIs, ocupación, ingresos y métricas de satisfacción.'
    }
  ];

  testimonials = [
    {
      name: 'Dra. María García',
      role: 'Psicóloga Clínica',
      text: 'Psychology Assistant ha transformado cómo organizo mi consultorio. Antes pasaba horas en administración, ahora enfoco energía en pacientes.',
      avatar: '👩‍⚕️'
    },
    {
      name: 'Dr. Carlos López',
      role: 'Director de Clínica',
      text: 'La mejor inversión que hicimos. Mejoró eficiencia en 40% y satisfacción de pacientes aumentó cuando ven organización profesional.',
      avatar: '👨‍⚕️'
    },
    {
      name: 'Psicóloga Andrés Martín',
      role: 'Consultor Independiente',
      text: 'Plataforma intuitiva, soporte excelente, y siempre sumando features nuevas. Recomendado 100% a colegas.',
      avatar: '👨‍💼'
    }
  ];
}
