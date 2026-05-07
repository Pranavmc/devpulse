{{/*
Expand the name of the chart.
*/}}
{{- define "devpulse.name" -}}
{{- .Chart.Name }}
{{- end }}

{{/*
Create a default fully qualified app name.
Truncate to 63 characters because some Kubernetes name fields have limits.
*/}}
{{- define "devpulse.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "devpulse.labels" -}}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
app.kubernetes.io/name: {{ include "devpulse.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "devpulse.selectorLabels" -}}
app.kubernetes.io/name: {{ include "devpulse.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
