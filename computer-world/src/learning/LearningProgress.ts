/**
 * 학습 진행 상황 추적 시스템
 * 방문한 월드를 localStorage에 저장하여 데모 단계를 결정합니다.
 */
export class LearningProgress {
  private static readonly STORAGE_KEY = 'computer-world-progress';
  private visitedWorlds: Set<string>;

  constructor() {
    this.visitedWorlds = new Set(this.loadFromStorage());
  }

  /**
   * 방문한 월드를 기록합니다
   */
  markWorldVisited(worldName: string): void {
    if (!this.visitedWorlds.has(worldName)) {
      this.visitedWorlds.add(worldName);
      this.saveToStorage();
    }
  }

  /**
   * 특정 월드를 방문했는지 확인합니다
   */
  hasVisited(worldName: string): boolean {
    return this.visitedWorlds.has(worldName);
  }

  /**
   * 방문한 모든 월드를 반환합니다
   */
  getVisitedWorlds(): string[] {
    return Array.from(this.visitedWorlds);
  }

  /**
   * 방문한 월드의 수를 반환합니다
   */
  getVisitedCount(): number {
    return this.visitedWorlds.size;
  }

  /**
   * 현재 데모 단계를 반환합니다 (1-4)
   * 1단계: Real World + Hardware World
   * 2단계: + Network World
   * 3단계: + OS World
   * 4단계: + 모든 월드
   */
  getCurrentStage(): number {
    const visited = this.visitedWorlds;
    
    if (visited.has('real-world') && visited.has('hardware')) {
      if (visited.has('network')) {
        if (visited.has('os')) {
          if (visited.has('browser') || visited.has('javascript') || visited.has('frontend') || visited.has('backend') || visited.has('database')) {
            return 4;
          }
          return 3;
        }
        return 2;
      }
      return 1;
    }
    
    return 0;
  }

  /**
   * 현재 단계의 데모 단계들을 반환합니다
   */
  getDemoStages(): string[] {
    const stage = this.getCurrentStage();
    const stages: string[] = ['real-world', 'hardware'];
    
    if (stage >= 2) {
      stages.push('network');
    }
    if (stage >= 3) {
      stages.push('os');
    }
    if (stage >= 4) {
      if (this.visitedWorlds.has('browser')) stages.push('browser');
      if (this.visitedWorlds.has('javascript')) stages.push('javascript');
      if (this.visitedWorlds.has('frontend')) stages.push('frontend');
      if (this.visitedWorlds.has('backend')) stages.push('backend');
      if (this.visitedWorlds.has('database')) stages.push('database');
    }
    
    return stages;
  }

  private loadFromStorage(): string[] {
    try {
      const data = localStorage.getItem(LearningProgress.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(LearningProgress.STORAGE_KEY, JSON.stringify(Array.from(this.visitedWorlds)));
    } catch (e) {
      console.warn('Failed to save learning progress:', e);
    }
  }

  /**
   * 진행 상황을 초기화합니다 (테스트용)
   */
  reset(): void {
    this.visitedWorlds.clear();
    this.saveToStorage();
  }
}

export const learningProgress = new LearningProgress();
